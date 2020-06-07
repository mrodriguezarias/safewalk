import { Joi } from "express-validation"

const authValidation = {
  signUp: {
    body: Joi.object({
      name: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  logIn: {
    body: Joi.object({
      name: Joi.string().required(),
      password: Joi.string().required(),
      shouldBeAdmin: Joi.boolean().default(false),
    }),
  },
}

export default authValidation
