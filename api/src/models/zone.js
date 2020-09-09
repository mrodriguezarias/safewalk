import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"
import pointSchema from "./schemas/point"

const ZoneSchema = new Schema(
  {
    radius: { type: Number, required: true },
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

const zoneModel = model("zone", ZoneSchema)

export default zoneModel
