import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const userSchema = new Schema(
  {
    name: { type: String, index: { unique: true } },
    password: String,
    phone: { type: String, default: null },
    admin: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
  },
  {
    toJSON: dbUtils.toJSON,
  },
)

const userModel = model("User", userSchema)

export default userModel
