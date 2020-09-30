import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const contactSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  source: Joi.string().custom(validationUtils.objectId),
  target: Joi.string().custom(validationUtils.objectId),
  relation: Joi.string().valid("carer", "cared"),
  confirmed: Joi.boolean().default(false),
  created: Joi.date(),
}

const contactValidation = {
  getContact: {
    params: Joi.object({
      id: contactSchema.id.required(),
    }),
  },
  createContact: {
    body: Joi.object({
      source: contactSchema.source.required(),
      target: contactSchema.target.required(),
      relation: contactSchema.relation.required(),
      confirmed: contactSchema.confirmed,
      created: contactSchema.created,
    }),
  },
  updateContact: {
    params: Joi.object({
      id: contactSchema.id.required(),
    }),
    body: Joi.object({
      id: contactSchema.id,
      source: contactSchema.source,
      target: contactSchema.target,
      relation: contactSchema.relation,
      confirmed: contactSchema.confirmed,
      created: contactSchema.created,
    }),
  },
  deleteContact: {
    params: Joi.object({
      id: contactSchema.id.required(),
    }),
  },
  respond: {
    params: Joi.object({
      id: contactSchema.id.required(),
    }),
    body: Joi.object({
      confirmed: contactSchema.confirmed.required(),
    }),
  },
}

export default contactValidation
