import mongoose from "mongoose"
import dbUtils from "../utils/db"
import pointSchema from "./schemas/point"

const weightType = {
  type: Number,
  default: 0,
}

const weightsSchema = new mongoose.Schema({
  crime: weightType,
  places: weightType,
  zones: weightType,
})

const nodeSchema = new mongoose.Schema(
  {
    weights: weightsSchema,
    location: {
      type: pointSchema,
      required: true,
      index: "2dsphere",
    },
  },
  {
    toJSON: dbUtils.toJSONWithoutLocation(),
  },
)

nodeSchema.index({ location: "2dsphere" })

const nodeModel = mongoose.model("Node", nodeSchema)

export default nodeModel
