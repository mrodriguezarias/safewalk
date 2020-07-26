import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const pathSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  from: Joi.string().custom(validationUtils.objectId),
  to: Joi.string().custom(validationUtils.objectId),
}

const pathValidation = {
  getPath: {
    params: Joi.object({
      id: pathSchema.id.required(),
    }),
  },
  createPath: {
    body: Joi.object({
      from: pathSchema.from.required(),
      to: pathSchema.to.required(),
    }),
  },
  updatePath: {
    params: Joi.object({
      id: pathSchema.id.required(),
    }),
    body: Joi.object({
      id: pathSchema.id,
      from: pathSchema.from,
      to: pathSchema.to,
    }),
  },
  deletePath: {
    params: Joi.object({
      id: pathSchema.id.required(),
    }),
  },
}

export default pathValidation
