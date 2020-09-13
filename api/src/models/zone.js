import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"
import pointSchema from "./schemas/point"

const ZoneSchema = new Schema(
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

const zoneModel = model("zone", ZoneSchema)

export default zoneModel
