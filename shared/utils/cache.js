import fs from "fs"
import nodeService from "../../api/src/services/node"
import pathService from "../../api/src/services/path"
import createGraph from "ngraph.graph"
import generalUtils from "./general"
import _ from "lodash"

const CACHE_PATH = "./data/cache.json"

const loadCache = async () => {
  const cache = {}
  global._cache = cache
  for (const { key, loader } of elements) {
    const value = await loader()
    cache[key] = value
  }
  console.info("Cache loaded")
}

const loadGraph = async () => {
  const { nodes } = await nodeService.getNodes()
  const { paths } = await pathService.getPaths()
  const graph = createGraph()
  for (const { id, longitude, latitude, weights } of nodes) {
    const weight = _.sum(Object.values(weights))
    graph.addNode(id, { longitude, latitude, weight })
  }
  for (const { from, to } of paths) {
    graph.addLink(from, to)
  }
  return graph
}

const elements = [{ key: "Graph", loader: loadGraph }]

const cacheUtils = {
  load: () => {
    generalUtils.debounce(loadCache)
  },
  get: async (key, wait = true) => {
    if (!wait) {
      return global._cache[key]
    }
    while (true) {
      const value = global._cache[key]
      if (value !== undefined) {
        return value
      }
      await generalUtils.sleep(500)
    }
  },
  set: (key, value) => {
    global._cache[key] = value
  },
  keys: elements.reduce(
    (accum, cur) => ({
      ...accum,
      [cur.key]: cur.key,
    }),
    {},
  ),
  writeToDisk: () => {
    const data = JSON.stringify(global._cache)
    fs.writeFileSync(CACHE_PATH, data)
  },
  readFromDisk: () => {
    const data = fs.readFileSync(CACHE_PATH)
    global._cache = JSON.parse(data)
  },
}

export default cacheUtils
