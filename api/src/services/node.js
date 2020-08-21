import HttpStatus from "http-status-codes"
import nodeModel from "../models/node"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

const nodeService = {
  getNodes: async ({ filter = {}, range, sort } = {}) => {
    filter = dbUtils.transformQueryFilter(filter)
    const query = nodeModel.find(filter)
    const count = await nodeModel.estimatedDocumentCount()
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    const nodes = _.map(sorted, (node) => node.toJSON())
    return { nodes, contentRangeHeader }
  },
  getNodeById: async (nodeId) => {
    const node = await nodeModel.findById(nodeId)
    if (!node) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }
    return node.toJSON()
  },
  createNode: async (nodeData) => {
    if (_.isEmpty(nodeData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Node not provided")
    }
    nodeData = dbUtils.toDocWithLocation(nodeData)
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

    nodeData = dbUtils.toDocWithLocation(nodeData)
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
    return updatedNode.toJSON()
  },
  deleteNode: async (nodeId) => {
    const node = await nodeModel.findByIdAndDelete(nodeId)
    if (!node) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }
    return node.toJSON()
  },
  deleteAllNodes: async () => {
    const count = await nodeModel.estimatedDocumentCount()
    if (count > 0) {
      await nodeModel.collection.drop()
    }
  },
  getNearestNode: async (longitude, latitude) => {
    const nearest = await nodeModel.findOne({
      location: {
        $near: {
          $maxDistance: 200,
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
    })
    if (!nearest) {
      return null
    }
    return nearest.toJSON()
  },
  updateNearestNode: async (longitude, latitude, weight) => {
    const nearest = await nodeModel.findOneAndUpdate(
      {
        location: {
          $near: {
            $maxDistance: 100,
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          },
        },
      },
      { $inc: { weight } },
      {
        returnOriginal: false,
      },
    )
    if (!nearest) {
      return null
    }
    return nearest.toJSON()
  },
  resetWeights: async () => {
    await nodeModel.updateMany({}, { weight: 0 })
  },
}

export default nodeService
