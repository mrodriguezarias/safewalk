import HttpStatus from "http-status-codes"
import walkService from "../services/walk"

const walkController = {
  getWalks: async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query
      const { walks, contentRangeHeader } = await walkService.getWalks({
        filter,
        range,
        sort,
      })
      res.header("Content-Range", contentRangeHeader)
      res.status(HttpStatus.OK).json(walks)
    } catch (error) {
      next(error)
    }
  },
  getWalkById: async (req, res, next) => {
    const id = req.params.id
    try {
      const walk = await walkService.getWalkById(id)
      res.status(HttpStatus.OK).json(walk)
    } catch (error) {
      next(error)
    }
  },
  createWalk: async (req, res, next) => {
    const data = req.body
    try {
      const response = await walkService.createWalk(data)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updateWalk: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const response = await walkService.updateWalk(id, data)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deleteWalk: async (req, res, next) => {
    const id = req.params.id
    try {
      const response = await walkService.deleteWalk(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default walkController
