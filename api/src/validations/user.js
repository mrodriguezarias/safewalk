import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const userSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  name: Joi.string().min(4).max(16),
  phone: Joi.string()
    .min(10)
    .max(20)
    .regex(/^\+?\d+$/)
    .allow(null),
  password: Joi.string().min(8).max(32),
  admin: Joi.boolean().default(false),
  premium: Joi.boolean().default(false),
  blocked: Joi.boolean().default(false),
  pushToken: Joi.string().allow(null),
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
      phone: userSchema.phone,
      admin: userSchema.admin,
      premium: userSchema.premium,
      blocked: userSchema.blocked,
      pushToken: userSchema.pushToken,
    }),
  },
  updateUser: {
    params: Joi.object({
      id: userSchema.id.required(),
    }),
    body: Joi.object({
      id: userSchema.id,
      name: userSchema.name,
      phone: userSchema.phone,
      password: userSchema.password,
      admin: userSchema.admin,
      premium: userSchema.premium,
      blocked: userSchema.blocked,
      pushToken: userSchema.pushToken,
    }),
  },
  deleteUser: {
    params: Joi.object({
      id: userSchema.id.required(),
    }),
  },
}

export default userValidation
