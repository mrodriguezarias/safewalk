import fs from "fs"
import dbUtils from "../shared/utils/db"
import nodeService from "../api/src/services/node"
import pathService from "../api/src/services/path"
import consoleUtils from "../shared/utils/console"

const uploadGeoData = {
  name: "upload_geo_data",
  nodes: [],
  paths: [],
  run: async (args) => {
    const path = uploadGeoData.parseArgs(args)
    uploadGeoData.parseFile(path)
    await uploadGeoData.uploadToDatabase()
  },
  parseArgs: (args) => {
    const path = args._?.[1] ?? "./data/caba.json"
    if (!fs.existsSync(path)) {
      throw Error(`file '${path}' does not exist`)
    }
    return path
  },
  parseFile: (path) => {
    console.log("Parsing file…")
    const data = fs.readFileSync(path)
    const { elements } = JSON.parse(data)
    for (const element of elements) {
      switch (element.type) {
        case "node":
          uploadGeoData.processNode(element)
          break
        case "way":
          uploadGeoData.processPath(element)
          break
        default:
      }
    }
    const numNodes = uploadGeoData.nodes.length
    const numPaths = uploadGeoData.paths.length
    console.log(`Processed ${numNodes} nodes and ${numPaths} paths`)
  },
  processNode: ({ id, lon, lat }) => {
    uploadGeoData.nodes.push({
      id,
      longitude: lon,
      latitude: lat,
      weight: 0,
    })
  },
  processPath: ({ nodes }) => {
    if (!nodes || nodes.length === 0) {
      return
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i]
      const to = nodes[i + 1]
      uploadGeoData.paths.push({ from, to })
    }
  },
  uploadToDatabase: async () => {
    const nodeIdMap = new Map()
    await dbUtils.connect(true)
    console.log("Starting database upload…")
    try {
      console.log("Deleting preexisting nodes…")
      await nodeService.deleteAllNodes()
      for (const [index, nodeData] of uploadGeoData.nodes.entries()) {
        uploadGeoData.printUploadProgress("node", index)
        const node = await nodeService.createNode(nodeData)
        nodeIdMap.set(nodeData.id, node.id)
      }
      console.log("Deleting preexisting paths…")
      await pathService.deleteAllPaths()
      for (const [index, { from, to }] of uploadGeoData.paths.entries()) {
        uploadGeoData.printUploadProgress("path", index)
        const pathData = {
          from: nodeIdMap.get(from),
          to: nodeIdMap.get(to),
        }
        await pathService.createPath(pathData)
      }
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
  printUploadProgress: (element, index) => {
    const current = index + 1
    const total = uploadGeoData[`${element}s`].length
    consoleUtils.printProgress(`Adding ${element}`, current, total)
  },
}

export default uploadGeoData
