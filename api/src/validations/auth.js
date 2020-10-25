import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

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
  logOut: {
    body: Joi.object({
      userId: Joi.string().custom(validationUtils.objectId).required(),
    }),
  },
}

export default authValidation
