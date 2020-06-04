import { Joi } from "express-validation"
import userSchema from "./schemas/user"

const userValidation = {
  getUser: {
    params: Joi.object({
      id: userSchema.id.required(),
    }),
  },
  createUser: {
    body: Joi.object({
      name: userSchema.name.required(),
      password: userSchema.password.required(),
    }),
  },
  updateUser: {
    params: Joi.object({
      id: userSchema.id.required(),
    }),
    body: Joi.object({
      name: userSchema.name,
      password: userSchema.password,
      admin: userSchema.admin,
    }),
  },
  deleteUser: {
    params: Joi.object({
      id: userSchema.id.required(),
    }),
  },
}

export default userValidation
