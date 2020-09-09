import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const zoneSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  longitude: Joi.number(),
  latitude: Joi.number(),
  radius: Joi.number().min(50).max(200),
}

const zoneValidation = {
  getZone: {
    params: Joi.object({
      id: zoneSchema.id.required(),
    }),
  },
  createZone: {
    body: Joi.object({
      longitude: zoneSchema.longitude.required(),
      latitude: zoneSchema.latitude.required(),
      radius: zoneSchema.radius,
    }),
  },
  updateZone: {
    params: Joi.object({
      id: zoneSchema.id.required(),
    }),
    body: Joi.object({
      id: zoneSchema.id,
      longitude: zoneSchema.longitude,
      latitude: zoneSchema.latitude,
      radius: zoneSchema.radius,
    }),
  },
  deleteZone: {
    params: Joi.object({
      id: zoneSchema.id.required(),
    }),
  },
}

export default zoneValidation
