import mongoose from "mongoose"
import dbUtils from "../utils/db"
import pointSchema from "./schemas/point"

const zoneSchema = new mongoose.Schema(
  {
    location: {
      type: pointSchema,
      required: true,
      index: "2dsphere",
    },
    radius: { type: Number, required: true },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: dbUtils.toJSONWithoutLocation(),
  },
)

zoneSchema.index({ location: "2dsphere" })

const zoneModel = mongoose.model("zone", zoneSchema)

export default zoneModel
