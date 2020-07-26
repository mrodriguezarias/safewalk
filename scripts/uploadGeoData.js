import fs from "fs"
import envUtils from "../shared/utils/env"
import dbUtils from "../shared/utils/db"
import nodeService from "../api/src/services/node"
import pathService from "../api/src/services/path"

const uploadGeoData = {
  name: "upload_geo_data",
  nodes: [],
  paths: [],
  run: async (args) => {
    const fileName = args.join(" ")
    if (!fileName) {
      console.error("Please enter the path for the dataset to upload")
      return
    }
    uploadGeoData.loadEnv()
    uploadGeoData.parseFile(fileName)
    uploadGeoData.uploadToDatabase()
  },
  loadEnv: () => {
    envUtils.load({
      platform: "script",
      env: "local",
      libs: {
        dotenv: require("dotenv"),
      },
    })
  },
  parseFile: (fileName) => {
    const data = fs.readFileSync(fileName)
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
    try {
      await nodeService.deleteAllNodes()
      for (const nodeData of uploadGeoData.nodes) {
        const node = await nodeService.createNode(nodeData)
        nodeIdMap.set(nodeData.id, node.id)
      }
      await pathService.deleteAllPaths()
      for (const { from, to } of uploadGeoData.paths) {
        const pathData = {
          from: nodeIdMap.get(from),
          to: nodeIdMap.get(to),
        }
        await pathService.createPath(pathData)
      }
      console.log(
        `Added ${uploadGeoData.nodes.length} nodes and ${uploadGeoData.paths.length} paths`,
      )
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
}

export default uploadGeoData
