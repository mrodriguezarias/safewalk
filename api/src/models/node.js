import { Schema, model } from "mongoose"

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
})

const nodeSchema = new Schema({
  weight: { type: Number, default: 0 },
  location: {
    type: pointSchema,
    required: true,
    index: "2dsphere",
  },
})

const nodeModel = model("Node", nodeSchema)

export default nodeModel
