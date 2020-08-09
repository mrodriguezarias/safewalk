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
  loginAttempts: Joi.number().default(0),
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
      loginAttempts: userSchema.loginAttempts,
    }),
  },
  deleteUser: {
    params: Joi.object({
      id: userSchema.id.required(),
    }),
  },
}

export default userValidation
