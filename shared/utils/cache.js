import NodeCache from "node-cache"
import nodeService from "../../api/src/services/node"
import pathService from "../../api/src/services/path"
import createGraph from "ngraph.graph"
import generalUtils from "./general"

const loadCache = async () => {
  const cache = new NodeCache({ stdTTL: 86400, checkperiod: 0 })
  global._cache = cache
  for (const { key, loader } of elements) {
    const value = await loader()
    cache.set(key, value)
  }
  console.info("Cache loaded")
}

const loadGraph = async () => {
  const { nodes } = await nodeService.getNodes()
  const { paths } = await pathService.getPaths()
  const graph = createGraph()
  for (const { id, longitude, latitude, weight } of nodes) {
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
      return global._cache.get(key)
    }
    while (true) {
      const value = global._cache.get(key)
      if (value !== undefined) {
        return value
      }
      await generalUtils.sleep(500)
    }
  },
  set: (key, value, ttl) => {
    global._cache.set(key, value, ttl)
  },
  keys: elements.reduce(
    (accum, cur) => ({
      ...accum,
      [cur.key]: cur.key,
    }),
    {},
  ),
}

export default cacheUtils
