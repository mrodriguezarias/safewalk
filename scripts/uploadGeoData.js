import fs from "fs"
import dbUtils from "../shared/utils/db"
import nodeService from "../api/src/services/node"
import pathService from "../api/src/services/path"
import consoleUtils from "../shared/utils/console"
import createGraph from "ngraph.graph"

const uploadGeoData = {
  name: "upload_geo_data",
  graph: createGraph(),
  nodeMap: new Map(),
  nodes: [],
  paths: [],
  run: async (args) => {
    const path = uploadGeoData.parseArgs(args)
    uploadGeoData.parseFile(path)
    uploadGeoData.processGraph()
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
    console.info("Parsing file…")
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
  },
  processNode: ({ id, lon, lat }) => {
    uploadGeoData.nodeMap.set(id, {
      longitude: lon,
      latitude: lat,
    })
  },
  processPath: ({ nodes }) => {
    if (!nodes || nodes.length === 0) {
      return
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i]
      const to = nodes[i + 1]
      uploadGeoData.graph.addLink(from, to)
    }
  },
  processGraph: () => {
    console.info("Processing graph…")
    const latLonToNodeId = new Map()
    const nodesToDelete = new Set()
    uploadGeoData.graph.forEachNode((node) => {
      const data = uploadGeoData.nodeMap.get(node.id)
      if (!data) {
        throw new Error(`missing data for ${node.id}`)
      }
      const xyID = `${data.longitude};${data.latitude}`
      const prevNode = latLonToNodeId.get(xyID)
      if (prevNode) {
        nodesToDelete.add(node.id)
      } else {
        latLonToNodeId.set(xyID, node)
      }
      node.data = data
    })
    uploadGeoData.nodeMap.clear()
    latLonToNodeId.clear()
    nodesToDelete.forEach((nodeId) => {
      uploadGeoData.graph.removeNode(nodeId)
    })
    nodesToDelete.clear()
    const nodeCount = uploadGeoData.graph.getNodesCount()
    const pathCount = uploadGeoData.graph.getLinksCount()
    console.info(`Graph has ${nodeCount} nodes and ${pathCount} paths`)
    uploadGeoData.graph.forEachNode((node) => {
      uploadGeoData.nodes.push({
        id: node.id,
        longitude: node.data.longitude,
        latitude: node.data.latitude,
      })
    })
    uploadGeoData.graph.forEachLink((path) => {
      uploadGeoData.paths.push({
        from: path.fromId,
        to: path.toId,
      })
    })
    uploadGeoData.graph.clear()
  },
  uploadToDatabase: async () => {
    const nodeIdMap = new Map()
    await dbUtils.connect(true)
    console.info("Starting database upload…")
    try {
      console.info("Deleting preexisting nodes…")
      await nodeService.deleteAllNodes()
      for (const [index, nodeData] of uploadGeoData.nodes.entries()) {
        uploadGeoData.printUploadProgress("node", index)
        const node = await nodeService.createNode(nodeData)
        nodeIdMap.set(nodeData.id, node.id)
      }
      console.info("Deleting preexisting paths…")
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
