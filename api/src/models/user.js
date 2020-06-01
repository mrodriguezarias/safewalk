import { Schema, model } from "mongoose"

const userSchema = new Schema({
  name: String,
  password: String,
  admin: { type: Boolean, default: false },
})

const userModel = model("User", userSchema)

export default userModel
