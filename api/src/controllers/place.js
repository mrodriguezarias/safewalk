import HttpStatus from "http-status-codes"
import placeService from "../services/place"

const placeController = {
  getPlaces: async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query
      const { places, contentRangeHeader } = await placeService.getPlaces(
        filter,
        range,
        sort,
      )
      res.header("Content-Range", contentRangeHeader)
      res.status(HttpStatus.OK).json(places)
    } catch (error) {
      next(error)
    }
  },
  getPlaceById: async (req, res, next) => {
    const id = req.params.id
    try {
      const user = await placeService.getPlaceById(id)
      res.status(HttpStatus.OK).json(user)
    } catch (error) {
      next(error)
    }
  },
  createPlace: async (req, res, next) => {
    const data = req.body
    try {
      const response = await placeService.createPlace(data)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updatePlace: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const response = await placeService.updatePlace(id, data)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deletePlace: async (req, res, next) => {
    const id = req.params.id
    try {
      const response = await placeService.deletePlace(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default placeController
