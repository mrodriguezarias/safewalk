import fs from "fs"
import csvParser from "csv-parse"
import consoleUtils from "../shared/utils/console"
import nodeService from "../api/src/services/node"
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
])

const uploadWeights = {
  name: "upload_weights",
  count: 0,
  batch: 0,
  items: [],
  run: async (args) => {
    const path = uploadWeights.parseArgs(args)
    await uploadWeights.countLines(path)
    await dbUtils.connect(true)
    let from = 2
    let to = 0
    try {
      while (to !== undefined) {
        to += BATCH_SIZE + 1
        if (to > uploadWeights.count) {
          to = undefined
        }
        await uploadWeights.parseFile(path, from, to)
        await uploadWeights.processBatch()
        uploadWeights.batch += 1
        uploadWeights.items = []
        from += BATCH_SIZE
      }
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
          uploadWeights.count = count
          resolve(count)
        })
        .on("error", reject)
    }),
  parseFile: (path, from, to) =>
    new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .pipe(
          csvParser({
            from_line: from,
            to_line: to,
            columns: COLUMNS,
          }),
        )
        .on("data", async (data) => uploadWeights.items.push(data))
        .on("end", resolve)
        .on("error", reject)
    }),
  processBatch: async () => {
    for (const [index, item] of uploadWeights.items.entries()) {
      const overallIndex = uploadWeights.batch * BATCH_SIZE + index
      await uploadWeights.processItem(item, overallIndex)
    }
  },
  processItem: async (item, index) => {
    consoleUtils.printProgress(
      "Processing item",
      index + 1,
      uploadWeights.count,
    )
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
}

export default uploadWeights
