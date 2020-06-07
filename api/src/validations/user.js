import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const userSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  name: Joi.string().min(4).max(16),
  password: Joi.string().min(8).max(32),
  admin: Joi.boolean().default(false),
}

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
      admin: userSchema.admin,
    }),
  },
  updateUser: {
    params: Joi.object({
      id: userSchema.id.required(),
    }),
    body: Joi.object({
      id: userSchema.id,
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
