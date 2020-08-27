import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"
import pointSchema from "./schemas/point"
import lineSchema from "./schemas/line"

const walkSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    path: {
      type: lineSchema,
      required: true,
      index: "2dsphere",
    },
    walked: {
      type: lineSchema,
      index: "2dsphere",
    },
    position: {
      type: pointSchema,
      required: true,
      index: "2dsphere",
    },
    start: { type: Date, default: Date.now },
    end: { type: Date, default: null },
    updated: { type: Date, default: Date.now },
    arrived: { type: Boolean, default: false },
  },
  {
    toJSON: dbUtils.toJSONFromGeoJSON(),
  },
)

const walkModel = model("Walk", walkSchema)

export default walkModel
