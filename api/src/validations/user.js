import { Joi } from "express-validation"
import { pushTypes } from "../../../shared/utils/push"
import validationUtils from "../utils/validation"

const notificationsSchema = Object.keys(pushTypes).reduce(
  (obj, key) => ({ ...obj, [key]: Joi.boolean().default(false) }),
  {},
)

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
  canChangeLocation: Joi.boolean().default(false),
  premium: Joi.boolean().default(false),
  blocked: Joi.boolean().default(false),
  pushToken: Joi.string().allow(null),
  notifications: notificationsSchema,
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
      canChangeLocation: userSchema.canChangeLocation,
      premium: userSchema.premium,
      blocked: userSchema.blocked,
      pushToken: userSchema.pushToken,
      notifications: userSchema.notifications,
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
      canChangeLocation: userSchema.canChangeLocation,
      premium: userSchema.premium,
      blocked: userSchema.blocked,
      pushToken: userSchema.pushToken,
      notifications: userSchema.notifications,
    }),
  },
  deleteUser: {
    params: Joi.object({
      id: userSchema.id.required(),
    }),
  },
}

export default userValidation
