import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const nodeSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  longitude: Joi.number(),
  latitude: Joi.number(),
  weights: Joi.object({
    crime: Joi.number(),
    places: Joi.number(),
    zones: Joi.number(),
  }),
}

const nodeValidation = {
  getNode: {
    params: Joi.object({
      id: nodeSchema.id.required(),
    }),
  },
  createNode: {
    body: Joi.object({
      longitude: nodeSchema.longitude.required(),
      latitude: nodeSchema.latitude.required(),
      weights: nodeSchema.weights,
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
      weights: nodeSchema.weights,
    }),
  },
  deleteNode: {
    params: Joi.object({
      id: nodeSchema.id.required(),
    }),
  },
}

export default nodeValidation
