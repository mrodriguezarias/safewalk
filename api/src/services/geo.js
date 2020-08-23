import HttpStatus from "http-status-codes"
import _ from "lodash"
import HttpError from "../../../shared/errors/http"
import boundaryModel from "../models/boundary"
import placeModel from "../models/place"
import categoryModel from "../models/category"
import nodeService from "./node"
import npath from "ngraph.path"
import cacheUtils from "../../../shared/utils/cache"
import geoUtils from "../../../shared/utils/geo"

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
    return [target, ...coords, source]
  },
  getNearbyPlaces: async ({ longitude, latitude }, limit, distance = 200) => {
    let nearest = await placeModel.find({
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
    if (limit) {
      nearest = _.take(nearest, limit)
    }
    nearest = getCategories(nearest)
    return nearest
  },
  searchPlaces: async (query, limit) => {
    let places = await placeModel.find({
      $text: {
        $search: query,
      },
    })
    places = _.map(places, (place) => place.toJSON())
    if (limit) {
      places = _.take(places, limit)
    }
    places = getCategories(places)
    return places
  },
}

export default geoService
