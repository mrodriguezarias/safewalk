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
  getSafestPath: async (req, res, next) => {
    const { source, target } = req.body
    try {
      const response = await geoService.getSafestPath(source, target)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  getNearbyPlaces: async (req, res, next) => {
    const { location, query, limit, distance } = req.body
    try {
      const response = await geoService.getNearbyPlaces(
        location,
        query,
        limit,
        distance,
      )
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  getRelatedPlaces: async (req, res, next) => {
    const { place, limit, distance } = req.body
    try {
      const response = await geoService.getRelatedPlaces(place, limit, distance)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default geoController
