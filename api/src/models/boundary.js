import { Schema, model } from "mongoose"
import polygonSchema from "./schemas/polygon"

const boundarySchema = new Schema({
  location: {
    type: polygonSchema,
    required: true,
    index: "2dsphere",
  },
})

const boundaryModel = model("Boundary", boundarySchema)

export default boundaryModel
