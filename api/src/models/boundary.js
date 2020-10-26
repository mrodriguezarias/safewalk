import mongoose from "mongoose"
import polygonSchema from "./schemas/polygon"

const boundarySchema = new mongoose.Schema({
  location: {
    type: polygonSchema,
    required: true,
    index: "2dsphere",
  },
})

const boundaryModel = mongoose.model("Boundary", boundarySchema)

export default boundaryModel
