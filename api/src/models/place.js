import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"
import pointSchema from "./schemas/point"

const placeSchema = new Schema(
  {
    name: {
      type: String,
      index: { unique: false },
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    location: {
      type: pointSchema,
      index: "2dsphere",
      required: true,
    },
    safe: { type: Boolean, default: false },
  },
  {
    toJSON: dbUtils.toJSONWithoutLocation(),
  },
)

const placeModel = model("Place", placeSchema)

export default placeModel
