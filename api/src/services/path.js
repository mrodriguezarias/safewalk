import HttpStatus from "http-status-codes"
import pathModel from "../models/path"
import HttpError from "../../../shared/errors/http"
import generalUtils from "../../../shared/utils/general"
import dbUtils from "../utils/db"
import _ from "lodash"

const pathService = {
  getPaths: async (filter = {}, range, sort) => {
    filter = generalUtils.renameKey(filter, "id", "_id")
    const query = pathModel.find(filter)
    const count = await pathModel.estimatedDocumentCount()
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    return { paths: sorted, contentRangeHeader }
  },
  getPathById: async (pathId) => {
    const path = await pathModel.findById(pathId)
    if (!path) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Path not found")
    }
    return path
  },
  createPath: async (pathData) => {
    if (_.isEmpty(pathData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Path not provided")
    }

    pathData = _.omit(pathData, "id")
    const newPath = await pathModel.create({
      ...pathData,
    })
    return newPath.toJSON()
  },
  updatePath: async (pathId, pathData) => {
    if (_.isEmpty(pathData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Path not provided")
    }

    const path = await pathModel.findById(pathId)
    if (!path) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Path not found")
    }

    pathData = _.omit(pathData, "id")
    const updatedpath = await pathModel.findByIdAndUpdate(
      pathId,
      {
        ...pathData,
      },
      { new: true },
    )
    if (!updatedpath) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Path not found")
    }
    return updatedpath
  },
  deletePath: async (pathId) => {
    const path = await pathModel.findByIdAndDelete(pathId)
    if (!path) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Path not found")
    }
    return path
  },
  deleteAllPaths: async () => {
    await pathModel.deleteMany({})
  },
}

export default pathService
