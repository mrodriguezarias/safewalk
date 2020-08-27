import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const pointSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
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
    }),
  },
  deleteWalk: {
    params: Joi.object({
      id: walkSchema.id.required(),
    }),
  },
}

export default walkValidation
