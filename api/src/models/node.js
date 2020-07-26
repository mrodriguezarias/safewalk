import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const nodeSchema = new Schema(
  {
    longitude: Number,
    latitude: Number,
    weight: { type: Number, default: 0 },
  },
  {
    toJSON: dbUtils.toJSON,
  },
)

const nodeModel = model("Node", nodeSchema)

export default nodeModel
