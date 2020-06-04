import userSchema from "./schemas/user"
import { Joi } from "express-validation"

const authValidation = {
  signUp: {
    body: Joi.object({
      name: userSchema.name.required(),
      password: userSchema.password.required(),
    }),
  },
  logIn: {
    body: Joi.object({
      name: userSchema.name.required(),
      password: userSchema.password.required(),
      shouldBeAdmin: Joi.boolean().default(false),
    }),
  },
}

export default authValidation
