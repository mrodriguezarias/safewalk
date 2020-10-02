import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const userSchema = new Schema(
  {
    name: { type: String, index: { unique: true } },
    password: String,
    phone: { type: String, default: null },
    admin: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    pushToken: { type: String, default: null },
  },
  {
    toJSON: dbUtils.toJSON({
      next: (user) => {
        delete user.password
        delete user.loginAttempts
      },
    }),
  },
)

const userModel = model("User", userSchema)

export default userModel
