import HttpStatus from "http-status-codes"
import carerService from "../services/carer"

const carerController = {
  getCarers: async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query
      const { carers, contentRangeHeader } = await carerService.getCarers(
        filter,
        range,
        sort,
      )
      res.header("Content-Range", contentRangeHeader)
      res.status(HttpStatus.OK).json(carers)
    } catch (error) {
      next(error)
    }
  },
  getCarerById: async (req, res, next) => {
    const id = req.params.id
    try {
      const user = await carerService.getCarerById(id)
      res.status(HttpStatus.OK).json(user)
    } catch (error) {
      next(error)
    }
  },
  createCarer: async (req, res, next) => {
    const data = req.body
    try {
      const response = await carerService.createCarer(data)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updateCarer: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const response = await carerService.updateCarer(id, data)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deleteCarer: async (req, res, next) => {
    const id = req.params.id
    try {
      const response = await carerService.deleteCarer(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default carerController
