import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"
import geoPointSchema from "./schemas/point"
import lineSchema from "./schemas/line"

const pointSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  {
    toJSON: dbUtils.toJSON({ hideId: true }),
  },
)

const locationSchema = new Schema(
  {
    name: { type: String, required: true },
    coords: { type: pointSchema, required: true },
  },
  {
    toJSON: dbUtils.toJSON({ hideId: true }),
  },
)

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
      type: [pointSchema],
      default: [],
    },
    position: {
      type: geoPointSchema,
      required: true,
      index: "2dsphere",
    },
    start: { type: Date, default: Date.now },
    end: { type: Date, default: null },
    updated: { type: Date, default: Date.now },
    arrived: { type: Boolean, default: false },
    safe: { type: Boolean, default: true },
    source: { type: locationSchema, required: true },
    target: { type: locationSchema, required: true },
  },
  {
    toJSON: dbUtils.toJSONFromGeoJSON(),
  },
)

const walkModel = model("Walk", walkSchema)

export default walkModel