import mongoose from "mongoose"

const lineSchema = new mongoose.Schema({
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
