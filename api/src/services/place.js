import HttpStatus from "http-status-codes"
import placeModel from "../models/place"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

const placeService = {
  model: "place",
  getPlaces: async ({ filter = {}, range, sort } = {}) => {
    filter = dbUtils.transformQueryFilter(filter)
    const query = placeModel.find(filter)
    const count = await placeModel.count(filter)
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    const places = _.map(sorted, (place) => place.toJSON())
    return { places, contentRangeHeader }
  },
  getPlaceById: async (id) => {
    const place = await placeModel.findById(id)
    if (!place) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Place not found")
    }
    return place.toJSON()
  },
  createPlace: async (data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Place not provided")
    }
    data = dbUtils.toDocWithLocation(data)
    const place = await placeModel.create({
      ...data,
    })
    return place.toJSON()
  },
  updatePlace: async (id, data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Place not provided")
    }

    const place = await placeModel.findById(id)
    if (!place) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Place not found")
    }

    data = dbUtils.toDocWithLocation(data)
    const updatedPlace = await placeModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    )
    if (!updatedPlace) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }
    return updatedPlace.toJSON()
  },
  deletePlace: async (id) => {
    const place = await placeModel.findByIdAndRemove(id)
    if (!place) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Place not found")
    }
    return place.toJSON()
  },
  deleteAllPlaces: async () => {
    const count = await placeModel.count({})
    if (count > 0) {
      await placeModel.collection.drop()
    }
  },
}

export default placeService
