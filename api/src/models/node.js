import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"
import pointSchema from "./schemas/point"

const weightType = {
  type: Number,
  default: 0,
}

const weightsSchema = new Schema({
  crime: weightType,
  places: weightType,
  zones: weightType,
})

const nodeSchema = new Schema(
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

const nodeModel = model("Node", nodeSchema)

export default nodeModel
