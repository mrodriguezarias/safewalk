import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const carerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cared: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    confirmed: { type: Boolean, default: false },
  },
  {
    toJSON: dbUtils.toJSON(),
  },
)

const userModel = model("Carer", carerSchema)

export default userModel
