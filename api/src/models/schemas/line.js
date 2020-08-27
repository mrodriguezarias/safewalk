import { Schema } from "mongoose"

const lineSchema = new Schema({
  type: {
    type: String,
    enum: ["LineString"],
    required: true,
  },
  coordinates: {
    type: [[Number]],
    required: true,
  },
})

export default lineSchema
