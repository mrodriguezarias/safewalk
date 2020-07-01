import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const carerSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  user: Joi.string().custom(validationUtils.objectId),
  cared: Joi.string().custom(validationUtils.objectId),
  confirmed: Joi.boolean().default(false),
}

const carerValidation = {
  getCarer: {
    params: Joi.object({
      id: carerSchema.id.required(),
    }),
  },
  createCarer: {
    body: Joi.object({
      user: carerSchema.user.required(),
      cared: carerSchema.cared.required(),
      confirmed: carerSchema.confirmed,
    }),
  },
  updateCarer: {
    params: Joi.object({
      id: carerSchema.id.required(),
    }),
    body: Joi.object({
      id: carerSchema.id,
      user: carerSchema.user,
      cared: carerSchema.cared,
      confirmed: carerSchema.confirmed,
    }),
  },
  deleteCarer: {
    params: Joi.object({
      id: carerSchema.id.required(),
    }),
  },
}

export default carerValidation
