import HttpStatus from "http-status-codes"
import _ from "lodash"
import HttpError from "../../../shared/errors/http"
import boundaryModel from "../models/boundary"

const boundaryService = {
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
    await boundaryModel.deleteMany({})
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
}

export default boundaryService
