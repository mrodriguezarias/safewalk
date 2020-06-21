import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const userSchema = new Schema(
  {
    name: String,
    password: String,
    admin: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
  },
  {
    toJSON: dbUtils.toJSON,
  },
)

const userModel = model("User", userSchema)

export default userModel
