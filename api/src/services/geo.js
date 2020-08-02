import HttpStatus from "http-status-codes"
import _ from "lodash"
import HttpError from "../../../shared/errors/http"
import boundaryModel from "../models/boundary"
import nodeService from "./node"
import npath from "ngraph.path"
import cacheUtils from "../../../shared/utils/cache"
import geoUtils from "../../../shared/utils/geo"

const getDistance = (nodeA, nodeB) => {
  return -(nodeA.weight + nodeB.weight)
}

const geoService = {
  createBoundary: async (boundaryData) => {
    if (_.isEmpty(boundaryData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Boundary not provided")
    }
    const newBoundary = await boundaryModel.create({
      ...boundaryData,
    })
    return newBoundary
  },
  deleteAllBoundaries: async () => {
    const count = await boundaryModel.estimatedDocumentCount()
    if (count > 0) {
      await boundaryModel.collection.drop()
    }
  },
  isWithinBoundary: async (longitude, latitude) => {
    const result = await boundaryModel.findOne({
      location: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
    })
    return result !== null
  },
  getSafestPath: async (source, target) => {
    const dSource = geoUtils.getDistance(source)
    const dTarget = geoUtils.getDistance(target)
    if (dTarget < dSource) {
      ;[target, source] = [source, target]
    }
    const startPoint = await nodeService.getNearestNode(
      source.longitude,
      source.latitude,
    )
    const endPoint = await nodeService.getNearestNode(
      target.longitude,
      target.latitude,
    )
    const graph = await cacheUtils.get(cacheUtils.keys.Graph)
    const pathFinder = npath.aStar(graph, {
      oriented: true,
      distance: getDistance,
      heuristic: getDistance,
    })
    const path = pathFinder.find(startPoint.id, endPoint.id)
    const coords = path.map((point) => {
      const { longitude, latitude } = point.data
      return { longitude, latitude }
    })
    return [target, ...coords, source]
  },
}

export default geoService
