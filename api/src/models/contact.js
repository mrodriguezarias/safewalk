import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const contactSchema = new Schema(
  {
    carer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cared: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    confirmed: { type: Boolean, default: false },
  },
  {
    toJSON: dbUtils.toJSON(),
  },
)

const contactModel = model("Contact", contactSchema)

export default contactModel
