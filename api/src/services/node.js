import HttpStatus from "http-status-codes"
import nodeModel from "../models/node"
import HttpError from "../../../shared/errors/http"
import generalUtils from "../../../shared/utils/general"
import dbUtils from "../utils/db"
import _ from "lodash"

const nodeService = {
  getNodes: async (filter = {}, range, sort) => {
    filter = generalUtils.renameKey(filter, "id", "_id")
    const query = nodeModel.find(filter)
    const count = await nodeModel.estimatedDocumentCount()
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    return { nodes: sorted, contentRangeHeader }
  },
  getNodeById: async (nodeId) => {
    const node = await nodeModel.findById(nodeId)
    if (!node) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }
    return node
  },
  createNode: async (nodeData) => {
    if (_.isEmpty(nodeData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Node not provided")
    }

    nodeData = _.omit(nodeData, "id")
    const newNode = await nodeModel.create({
      ...nodeData,
    })
    return newNode.toJSON()
  },
  updateNode: async (nodeId, nodeData) => {
    if (_.isEmpty(nodeData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Node not provided")
    }

    const node = await nodeModel.findById(nodeId)
    if (!node) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }

    nodeData = _.omit(nodeData, "id")
    const updatedNode = await nodeModel.findByIdAndUpdate(
      nodeId,
      {
        ...nodeData,
      },
      { new: true },
    )
    if (!updatedNode) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }
    return updatedNode
  },
  deleteNode: async (nodeId) => {
    const node = await nodeModel.findByIdAndDelete(nodeId)
    if (!node) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }
    return node
  },
  deleteAllNodes: async () => {
    await nodeModel.deleteMany({})
  },
}

export default nodeService
