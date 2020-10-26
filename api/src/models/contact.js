import mongoose from "mongoose"
import dbUtils from "../utils/db"

const contactSchema = new mongoose.Schema(
  {
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relation: {
      type: String,
      enum: ["carer", "cared"],
    },
    confirmed: { type: Boolean, default: false },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: dbUtils.toJSON(),
  },
)

const contactModel = mongoose.model("Contact", contactSchema)

export default contactModel
