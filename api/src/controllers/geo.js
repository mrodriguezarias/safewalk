import HttpStatus from "http-status-codes"
import geoService from "../services/geo"

const geoController = {
  isWithinBoundary: async (req, res, next) => {
    const { longitude, latitude } = req.body
    try {
      const response = await geoService.isWithinBoundary(longitude, latitude)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  getSafePath: async (req, res, next) => {
    const { source, target } = req.body
    try {
      const response = await geoService.getSafePath(source, target)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default geoController
