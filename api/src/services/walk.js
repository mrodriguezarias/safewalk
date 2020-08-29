import HttpStatus from "http-status-codes"
import walkModel from "../models/walk"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

const geoKeys = {
  path: "line",
  position: "point",
}

const walkService = {
  getWalks: async ({ filter = {}, range, sort } = {}) => {
    filter = dbUtils.transformQueryFilter(filter)
    const query = walkModel.find(filter)
    const count = await walkModel.estimatedDocumentCount()
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    const walks = _.map(sorted, (walk) => walk.toJSON())
    return { walks, contentRangeHeader }
  },
  getWalkById: async (id) => {
    const walk = await walkModel.findById(id)
    if (!walk) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Walk not found")
    }
    return walk.toJSON()
  },
  createWalk: async (data) => {
    if (_.isEmpty(data) || !data?.path?.[0]) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Walk not provided")
    }
    if (!data.position) {
      data.position = data.path[0]
    }
    if (!data.walked) {
      data.walked = [data.position]
    }
    data = dbUtils.toGeoJSON(data, geoKeys)
    const walk = await walkModel.create({
      ...data,
    })
    return walk.toJSON()
  },
  updateWalk: async (id, data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Walk not provided")
    }

    const walk = await walkModel.findById(id)
    if (!walk) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Walk not found")
    }

    data = dbUtils.toGeoJSON(data, geoKeys)
    const updatedWalk = await walkModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    )
    if (!updatedWalk) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Walk not found")
    }
    return updatedWalk.toJSON()
  },
  deleteWalk: async (id) => {
    const walk = await walkModel.findByIdAndDelete(id)
    if (!walk) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Walk not found")
    }
    return walk.toJSON()
  },
  deleteAllWalks: async () => {
    const count = await walkModel.estimatedDocumentCount()
    if (count > 0) {
      await walkModel.collection.drop()
    }
  },
}

export default walkService
