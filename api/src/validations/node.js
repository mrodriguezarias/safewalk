import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const nodeSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  longitude: Joi.number(),
  latitude: Joi.number(),
  weight: Joi.number(),
}

const carerValidation = {
  getNode: {
    params: Joi.object({
      id: nodeSchema.id.required(),
    }),
  },
  createNode: {
    body: Joi.object({
      longitude: nodeSchema.longitude.required(),
      latitude: nodeSchema.latitude.required(),
      weight: nodeSchema.weight,
    }),
  },
  updateNode: {
    params: Joi.object({
      id: nodeSchema.id.required(),
    }),
    body: Joi.object({
      id: nodeSchema.id,
      longitude: nodeSchema.longitude,
      latitude: nodeSchema.latitude,
      weight: nodeSchema.weight,
    }),
  },
  deleteNode: {
    params: Joi.object({
      id: nodeSchema.id.required(),
    }),
  },
}

export default carerValidation
