import HttpStatus from "http-status-codes"
import HttpError from "../../../shared/errors/http"
import mongoose from "mongoose"
import generalUtils from "../../../shared/utils/general"

const dbUtils = {
  paginate: (query, range = [0, 0], count) => {
    if (range[1] - range[0] < 0) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        "Upper bound must be greater than lower bound",
      )
    }
    if (range[0] < 0) {
      throw new HttpError(HttpStatus.CONFLICT, "Out of range")
    }
    const paginated = query.skip(range[0]).limit(range[1] - range[0])
    const contentRangeHeader = `results ${range[0]}-${range[1]}/${count}`
    return [paginated, contentRangeHeader]
  },
  sort: (query, sort) => {
    return query.sort(sort ? { [sort[0]]: sort[1] } : {})
  },
  toJSON: (callback) => {
    const toJSON = {
      transform: (doc, ret) => {
        for (const key in ret) {
          if (ret[key] instanceof mongoose.Types.ObjectId) {
            ret[key] = ret[key].toString()
          }
        }
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        if (callback) {
          callback(ret)
        }
      },
    }
    return toJSON
  },
  toDocWithLocation: ({ longitude, latitude, ...data }) => ({
    ...data,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  }),
  toJSONWithoutLocation: (callback) => {
    return dbUtils.toJSON((ret) => {
      ret.longitude = ret.location.coordinates[0]
      ret.latitude = ret.location.coordinates[1]
      delete ret.location
      if (callback) {
        callback(ret)
      }
    })
  },
  transformQueryFilter: (filter, key = "name") => {
    filter = generalUtils.renameKey(filter, "id", "_id")
    const { q: query, ...restFilter } = filter ?? {}
    if (!query) {
      return filter
    }
    return {
      ...restFilter,
      [key]: new RegExp(`^${query}`, "i"),
    }
  },
}

export default dbUtils
