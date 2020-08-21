import HttpStatus from "http-status-codes"
import nodeService from "../services/node"

const nodeController = {
  getNodes: async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query
      const { nodes, contentRangeHeader } = await nodeService.getNodes({
        filter,
        range,
        sort,
      })
      res.header("Content-Range", contentRangeHeader)
      res.status(HttpStatus.OK).json(nodes)
    } catch (error) {
      next(error)
    }
  },
  getNodeById: async (req, res, next) => {
    const id = req.params.id
    try {
      const user = await nodeService.getNodeById(id)
      res.status(HttpStatus.OK).json(user)
    } catch (error) {
      next(error)
    }
  },
  createNode: async (req, res, next) => {
    const data = req.body
    try {
      const response = await nodeService.createNode(data)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updateNode: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const response = await nodeService.updateNode(id, data)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deleteNode: async (req, res, next) => {
    const id = req.params.id
    try {
      const response = await nodeService.deleteNode(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default nodeController
