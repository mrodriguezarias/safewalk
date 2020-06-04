import { Joi } from "express-validation"
import validationUtils from "../../utils/validation"

const userSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  name: Joi.string().min(3),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
  admin: Joi.boolean().default(false),
}

export default userSchema
