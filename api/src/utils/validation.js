import mongoose from "mongoose"
import _ from "lodash"

const validationUtils = {
  objectId: (value, helper) => {
    if (_.isString(value) && mongoose.Types.ObjectId.isValid(value)) {
      return true
    } else {
      return helper ? helper.message("Invalid id") : false
    }
  },
}

export default validationUtils
