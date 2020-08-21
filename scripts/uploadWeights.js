import fs from "fs"
import csvParser from "csv-parse"
import consoleUtils from "../shared/utils/console"
import nodeService from "../api/src/services/node"
import placeService from "../api/src/services/place"
import dbUtils from "../shared/utils/db"

const BATCH_SIZE = 1024
const COLUMNS = [
  "id",
  "fecha",
  "franja_horaria",
  "tipo_delito",
  "subtipo_delito",
  "cantidad_registrada",
  "comuna",
  "barrio",
  "lat",
  "long",
]
const POINTS = new Map([
  ["Lesiones", -2],
  ["Hurto (sin violencia)", -3],
  ["Hurto (con violencia)", -4],
  ["Robo (sin violencia)", -5],
  ["Robo (con violencia)", -6],
  ["Homicidio", -8],
  ["Safe Place", 100],
])

const uploadWeights = {
  name: "upload_weights",
  count: 0,
  batch: 0,
  items: [],
  run: async (args) => {
    const path = uploadWeights.parseArgs(args)
    await dbUtils.connect(true)
    try {
      await uploadWeights.resetWeights()
      await uploadWeights.processCriminalData(path)
      await uploadWeights.processSafePlaces()
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
  parseArgs: (args) => {
    const path = args._?.[1] ?? "./data/delitos_2019.csv"
    if (!fs.existsSync(path)) {
      throw Error(`file '${path}' does not exist`)
    }
    return path
  },
  countLines: (path) =>
    new Promise((resolve, reject) => {
      const NEW_LINE = "\n".charCodeAt(0)
      let count = -1
      fs.createReadStream(path)
        .on("data", (chunk) => {
          for (let i = 0; i < chunk.length; i++) {
            if (chunk[i] === NEW_LINE) {
              count++
            }
          }
        })
        .on("end", () => {
          resolve(count)
        })
        .on("error", reject)
    }),
  resetWeights: async () => {
    console.info("Resetting all weights…")
    await nodeService.resetWeights()
  },
  processCriminalData: async (path) => {
    console.info("Uploading weights from criminal data…")
    uploadWeights.count = await uploadWeights.countLines(path)
    let from = 2
    let to = 0
    while (to !== undefined) {
      to += BATCH_SIZE + 1
      if (to > uploadWeights.count) {
        to = undefined
      }
      uploadWeights.items = await uploadWeights.parseFile(path, from, to)
      await uploadWeights.processBatch(uploadWeights.processCriminalDataItem)
      from += BATCH_SIZE
    }
    uploadWeights.batch = 0
  },
  parseFile: (path, from, to) =>
    new Promise((resolve, reject) => {
      let items = []
      fs.createReadStream(path)
        .pipe(
          csvParser({
            from_line: from,
            to_line: to,
            columns: COLUMNS,
          }),
        )
        .on("data", async (data) => {
          items = [...items, data]
        })
        .on("end", () => {
          resolve(items)
        })
        .on("error", reject)
    }),
  processBatch: async (itemProcessor) => {
    for (const [index, item] of uploadWeights.items.entries()) {
      const current = uploadWeights.batch * BATCH_SIZE + index + 1
      consoleUtils.printProgress(
        "Processing item",
        current,
        uploadWeights.count,
      )
      await itemProcessor(item)
    }
    uploadWeights.batch += 1
    uploadWeights.items = []
  },
  processCriminalDataItem: async (item) => {
    const { tipo_delito: crime, lat, long } = item
    if (!crime || !long || !lat) {
      return
    }
    const weight = POINTS.get(crime)
    if (!weight) {
      return
    }
    await nodeService.updateNearestNode(long, lat, weight)
  },
  processSafePlaces: async () => {
    console.info("Uploading weights from safe places…")
    let from = 0
    let to = -1
    do {
      to += BATCH_SIZE
      const { contentRangeHeader, places } = await placeService.getPlaces({
        range: [from, to],
      })
      uploadWeights.count = +contentRangeHeader.split("/")[1]
      uploadWeights.items = places
      await uploadWeights.processBatch(uploadWeights.processSafePlacesItem)
      from += BATCH_SIZE
    } while (from < uploadWeights.count)
    uploadWeights.batch = 0
  },
  processSafePlacesItem: async (item) => {
    const { safe, longitude, latitude } = item
    if (!safe) {
      return
    }
    const weight = POINTS.get("Safe Place")
    await nodeService.updateNearestNode(longitude, latitude, weight)
  },
}

export default uploadWeights
