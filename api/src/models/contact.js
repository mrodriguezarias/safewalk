import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const contactSchema = new Schema(
  {
    source: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    target: {
      type: Schema.Types.ObjectId,
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

const contactModel = model("Contact", contactSchema)

export default contactModel
