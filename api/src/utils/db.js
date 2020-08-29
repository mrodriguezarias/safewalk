import HttpStatus from "http-status-codes"
import HttpError from "../../../shared/errors/http"
import mongoose from "mongoose"
import generalUtils from "../../../shared/utils/general"
import _ from "lodash"

const isGeoJsonObject = (value) => {
  return (
    _.isObject(value) &&
    _.has(value, "_id") &&
    _.has(value, "type") &&
    _.has(value, "coordinates")
  )
}

const dbUtils = {
  paginate: (query, range, count) => {
    if (!range) {
      range = [0, Math.max(count - 1, 0)]
    }
    if (range[1] - range[0] < 0) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        "Upper bound must be greater than lower bound",
      )
    }
    if (range[0] < 0) {
      throw new HttpError(HttpStatus.CONFLICT, "Out of range")
    }
    const paginated = query.skip(range[0]).limit(range[1] - range[0] + 1)
    const contentRangeHeader = `results ${range[0]}-${range[1]}/${count}`
    return [paginated, contentRangeHeader]
  },
  sort: (query, sort) => {
    return query.sort(sort ? { [sort[0]]: sort[1] } : {})
  },
  toJSON: ({ hideId = false, next } = {}) => {
    const toJSON = {
      transform: (doc, ret) => {
        for (const key in ret) {
          if (ret[key] instanceof mongoose.Types.ObjectId) {
            ret[key] = ret[key].toString()
          }
        }
        if (!hideId) {
          ret.id = ret._id.toString()
        }
        delete ret._id
        delete ret.__v
        if (next) {
          next(ret)
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
  toGeoJSON: (obj, keys) => {
    return _.reduce(
      obj,
      (result, value, key) => {
        const newValue = ((type) => {
          switch (type) {
            case "point":
              return {
                type: "Point",
                coordinates: [value.longitude, value.latitude],
              }
            case "line":
              return {
                type: "LineString",
                coordinates: value.map(({ longitude, latitude }) => [
                  longitude,
                  latitude,
                ]),
              }
            default:
              return value
          }
        })((keys[key] ?? "").toLowerCase())
        return { ...result, [key]: newValue }
      },
      {},
    )
  },
  toJSONFromGeoJSON: (next) => {
    return dbUtils.toJSON({
      next: (ret) => {
        for (const key in ret) {
          const value = ret[key]
          if (isGeoJsonObject(value)) {
            const newValue = (() => {
              switch (value.type) {
                case "LineString":
                  return value.coordinates.map(([longitude, latitude]) => ({
                    longitude,
                    latitude,
                  }))
                case "Point":
                  return {
                    longitude: value.coordinates[0],
                    latitude: value.coordinates[1],
                  }
                default:
                  return null
              }
            })()
            if (newValue) {
              ret[key] = newValue
            }
          }
        }
        if (next) {
          next(ret)
        }
      },
    })
  },
  toJSONWithoutLocation: (next) => {
    return dbUtils.toJSON({
      next: (ret) => {
        ret.longitude = ret.location.coordinates[0]
        ret.latitude = ret.location.coordinates[1]
        delete ret.location
        if (next) {
          next(ret)
        }
      },
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
