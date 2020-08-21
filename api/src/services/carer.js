import HttpStatus from "http-status-codes"
import carerModel from "../models/carer"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

const carerService = {
  getCarers: async (filter = {}, range, sort) => {
    filter = dbUtils.transformQueryFilter(filter)
    const query = carerModel.find(filter)
    const count = await carerModel.estimatedDocumentCount()
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    const carers = sorted
    return { carers, contentRangeHeader }
  },
  getCarerById: async (id) => {
    const carer = await carerModel.findById(id)
    if (!carer) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Carer not found")
    }
    return carer
  },
  createCarer: async (data) => {
    const carer = await carerModel.findOne({
      user: data.user,
      cared: data.cared,
    })
    if (carer) {
      throw new HttpError(HttpStatus.CONFLICT, "Carer already exists")
    }
    const newCarer = await carerModel.create(data)
    return newCarer
  },
  updateCarer: async (id, data) => {
    const carer = await carerModel.findById(id)
    if (!carer) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Carer not found")
    }

    data = _.omit(data, "id")
    const updatedCarer = await carerModel.findByIdAndUpdate(id, data, {
      new: true,
    })
    if (!updatedCarer) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Carer not found")
    }
    return updatedCarer
  },
  deleteCarer: async (id) => {
    const carer = await carerModel.findByIdAndDelete(id)
    if (!carer) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Carer not found")
    }
    return carer
  },
}

export default carerService
