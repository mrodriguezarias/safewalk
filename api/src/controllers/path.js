import HttpStatus from "http-status-codes"
import pathService from "../services/path"

const pathController = {
  getPaths: async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query
      const { paths, contentRangeHeader } = await pathService.getPaths({
        filter,
        range,
        sort,
      })
      res.header("Content-Range", contentRangeHeader)
      res.status(HttpStatus.OK).json(paths)
    } catch (error) {
      next(error)
    }
  },
  getPathById: async (req, res, next) => {
    const id = req.params.id
    try {
      const user = await pathService.getPathById(id)
      res.status(HttpStatus.OK).json(user)
    } catch (error) {
      next(error)
    }
  },
  createPath: async (req, res, next) => {
    const data = req.body
    try {
      const response = await pathService.createPath(data)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updatePath: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const response = await pathService.updatePath(id, data)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deletePath: async (req, res, next) => {
    const id = req.params.id
    try {
      const response = await pathService.deletePath(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default pathController
