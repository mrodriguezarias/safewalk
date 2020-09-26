import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const contactSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  carer: Joi.string().custom(validationUtils.objectId),
  cared: Joi.string().custom(validationUtils.objectId),
  creator: Joi.string().custom(validationUtils.objectId),
  confirmed: Joi.boolean().default(false),
}

const contactValidation = {
  getContact: {
    params: Joi.object({
      id: contactSchema.id.required(),
    }),
  },
  createContact: {
    body: Joi.object({
      carer: contactSchema.carer.required(),
      cared: contactSchema.cared.required(),
      creator: contactSchema.creator.required(),
      confirmed: contactSchema.confirmed,
    }),
  },
  updateContact: {
    params: Joi.object({
      id: contactSchema.id.required(),
    }),
    body: Joi.object({
      id: contactSchema.id,
      carer: contactSchema.carer,
      cared: contactSchema.cared,
      creator: contactSchema.creator,
      confirmed: contactSchema.confirmed,
    }),
  },
  deleteContact: {
    params: Joi.object({
      id: contactSchema.id.required(),
    }),
  },
}

export default contactValidation
