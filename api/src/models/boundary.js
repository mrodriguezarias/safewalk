import { Schema, model } from "mongoose"

const polygonSchema = new Schema({
  type: {
    type: String,
    enum: ["Polygon"],
    required: true,
  },
  coordinates: {
    type: [[[Number]]],
    required: true,
  },
})

const boundarySchema = new Schema({
  location: {
    type: polygonSchema,
    required: true,
    index: "2dsphere",
  },
})

const boundaryModel = model("Boundary", boundarySchema)

export default boundaryModel
