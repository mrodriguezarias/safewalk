import HttpStatus from "http-status-codes"
import nodeModel from "../models/node"
import HttpError from "../../../shared/errors/http"
import generalUtils from "../../../shared/utils/general"
import dbUtils from "../utils/db"
import _ from "lodash"

const nodeService = {
  toInternalDoc: (nodeData) => ({
    ...(nodeData.weight && { weight: nodeData.weight }),
    location: {
      type: "Point",
      coordinates: [nodeData.longitude, nodeData.latitude],
    },
  }),
  toExternalDoc: (nodeData) => ({
    id: nodeData._id,
    longitude: nodeData.location.coordinates[0],
    latitude: nodeData.location.coordinates[1],
    weight: nodeData.weight,
  }),
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
    const nodes = _.map(sorted, (node) => nodeService.toExternalDoc(node))
    return { nodes, contentRangeHeader }
  },
  getNodeById: async (nodeId) => {
    const node = await nodeModel.findById(nodeId)
    if (!node) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }
    return nodeService.toExternalDoc(node)
  },
  createNode: async (nodeData) => {
    if (_.isEmpty(nodeData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Node not provided")
    }
    nodeData = nodeService.toInternalDoc(nodeData)
    const newNode = await nodeModel.create({
      ...nodeData,
    })
    return nodeService.toExternalDoc(newNode)
  },
  updateNode: async (nodeId, nodeData) => {
    if (_.isEmpty(nodeData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Node not provided")
    }

    const node = await nodeModel.findById(nodeId)
    if (!node) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }

    nodeData = nodeService.toInternalDoc(nodeData)
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
    return nodeService.toExternalDoc(updatedNode)
  },
  deleteNode: async (nodeId) => {
    const node = await nodeModel.findByIdAndDelete(nodeId)
    if (!node) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }
    return nodeService.toExternalDoc(node)
  },
  deleteAllNodes: async () => {
    await nodeModel.deleteMany({})
  },
  getNearestNode: async (longitude, latitude) => {
    const nearest = await nodeModel.findOne({
      location: {
        $near: {
          $maxDistance: 100,
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
    return nodeService.toExternalDoc(nearest)
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
    return nodeService.toExternalDoc(nearest)
  },
}

export default nodeService
