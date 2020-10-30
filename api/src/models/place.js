import mongoose from "mongoose"
import dbUtils from "../utils/db"
import pointSchema from "./schemas/point"

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: "text",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
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

placeSchema.index({ location: "2dsphere" })

const placeModel = mongoose.model("Place", placeSchema)

export default placeModel
