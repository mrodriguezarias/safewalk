import { Schema, model } from "mongoose"
import { pushTypes } from "../../../shared/utils/push"
import dbUtils from "../utils/db"

const notificationsSchema = new Schema({
  ...Object.keys(pushTypes).reduce(
    (obj, key) => ({ ...obj, [key]: { type: Boolean, default: true } }),
    {},
  ),
})

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
    notifications: notificationsSchema,
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
