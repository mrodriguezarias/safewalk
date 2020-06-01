import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const userSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  name: Joi.string().min(3),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
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
