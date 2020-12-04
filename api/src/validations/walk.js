import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const pointSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
})

const locationSchema = Joi.object({
  name: Joi.string().required(),
  coords: pointSchema.required(),
})

const walkSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  user: Joi.string().custom(validationUtils.objectId),
  path: Joi.array().items(pointSchema),
  walked: Joi.array().items(pointSchema),
  position: pointSchema,
  start: Joi.date(),
  end: Joi.date().allow(null),
  updated: Joi.date(),
  arrived: Joi.boolean().default(false),
  safe: Joi.boolean().default(true),
  source: locationSchema,
  target: locationSchema,
}

const walkValidation = {
  getWalk: {
    params: Joi.object({
      id: walkSchema.id.required(),
    }),
  },
  createWalk: {
    body: Joi.object({
      user: walkSchema.user.required(),
      path: walkSchema.path.required(),
      walked: walkSchema.walked,
      position: walkSchema.position,
      start: walkSchema.start,
      end: walkSchema.end,
      updated: walkSchema.updated,
      arrived: walkSchema.arrived,
      safe: walkSchema.safe,
      source: walkSchema.source.required(),
      target: walkSchema.target.required(),
    }),
  },
  updateWalk: {
    params: Joi.object({
      id: walkSchema.id.required(),
    }),
    body: Joi.object({
      id: walkSchema.id,
      user: walkSchema.user,
      path: walkSchema.path,
      walked: walkSchema.walked,
      position: walkSchema.position,
      start: walkSchema.start,
      end: walkSchema.end,
      updated: walkSchema.updated,
      arrived: walkSchema.arrived,
      safe: walkSchema.safe,
      source: walkSchema.source,
      target: walkSchema.target,
    }),
  },
  deleteWalk: {
    params: Joi.object({
      id: walkSchema.id.required(),
    }),
  },
  addPosition: {
    params: Joi.object({
      id: walkSchema.id.required(),
    }),
    body: Joi.object({
      position: walkSchema.position.required(),
    }),
  },
}

export default walkValidation
