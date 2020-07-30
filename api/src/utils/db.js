import HttpStatus from "http-status-codes"
import HttpError from "../../../shared/errors/http"
import mongoose from "mongoose"

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
  toJSON: {
    transform: (doc, ret) => {
      for (const key in ret) {
        if (ret[key] instanceof mongoose.Types.ObjectId) {
          ret[key] = ret[key].toString()
        }
      }
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
    },
  },
}

export default dbUtils
