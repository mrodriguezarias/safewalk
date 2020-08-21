import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"
import pointSchema from "./schemas/point"

const nodeSchema = new Schema(
  {
    weight: { type: Number, default: 0 },
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
