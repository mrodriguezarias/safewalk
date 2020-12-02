import HttpStatus from "http-status-codes"
import _ from "lodash"
import HttpError from "../../../shared/errors/http"
import boundaryModel from "../models/boundary"
import placeModel from "../models/place"
import categoryModel from "../models/category"
import placeService from "../services/place"
import nodeService from "./node"
import npath from "ngraph.path"
import cacheUtils from "../../../shared/utils/cache"
import geoUtils from "../../../shared/utils/geo"
import generalUtils from "../../../shared/utils/general"

const getDistance = (nodeA, nodeB) => {
  const distance =
    (nodeA.data.longitude - nodeB.data.longitude) ** 2 +
    (nodeA.data.latitude - nodeB.data.latitude) ** 2
  const weight = -nodeB.data.weight / 1e6
  if (distance > 1e-6) {
    return distance
  } else {
    return weight
  }
}

const getCategories = async (places) => {
  let placesWithCategories = []
  for (let place of places) {
    const category = await categoryModel.findById(place.category)
    place = {
      ...place,
      category: category.name,
    }
    placesWithCategories = [...placesWithCategories, place]
  }
  return placesWithCategories
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
    const count = await boundaryModel.count({})
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
    const dSource = geoUtils.getRawDistance(source)
    const dTarget = geoUtils.getRawDistance(target)
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
    const pathFinder = npath.nba(graph, {
      oriented: true,
      distance: getDistance,
      heuristic: getDistance,
    })
    const path = pathFinder.find(startPoint.id, endPoint.id)
    const coords = path.map((point) => {
      const { longitude, latitude } = point.data
      return { longitude, latitude }
    })
    return [target, ...coords, source].reverse()
  },
  getNearbyPlaces: async (coords, query, limit = 20, distance = 2000) => {
    const { longitude, latitude } = coords
    let nearest = await placeModel.find({
      location: {
        $near: {
          ...(distance && { $maxDistance: distance }),
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
    })
    if (query) {
      query = generalUtils.normalize(query)
      nearest = _.filter(nearest, (place) =>
        generalUtils.normalize(place.name).includes(query),
      )
    }
    nearest = _.map(nearest, (place) => place.toJSON())
    if (limit) {
      nearest = _.take(nearest, limit)
    }
    nearest = await getCategories(nearest)
    if (distance && nearest.length === 0) {
      nearest = await geoService.getNearbyPlaces(coords, query, limit, null)
    }
    return nearest
  },
  getRelatedPlaces: async (placeId, limit = 20, distance = 2000) => {
    const {
      id,
      category,
      longitude,
      latitude,
    } = await placeService.getPlaceById(placeId)
    let nearest = await placeModel.find({
      category,
      location: {
        $near: {
          $maxDistance: distance,
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
    })
    nearest = _.map(nearest, (place) => place.toJSON())
    nearest = _.filter(nearest, (place) => place.id !== id)
    if (limit) {
      nearest = _.take(nearest, limit)
    }
    nearest = await getCategories(nearest)
    return nearest
  },
}

export default geoService
