import HttpStatus from "http-status-codes"
import boundaryService from "../services/boundary"

const boundaryController = {
  isWithinBoundary: async (req, res, next) => {
    const { longitude, latitude } = req.body
    try {
      const response = await boundaryService.isWithinBoundary(
        longitude,
        latitude,
      )
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default boundaryController
