import mongoose from "mongoose"

const validationUtils = {
  objectId: (value, helper) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helper.message("Invalid id")
    } else {
      return true
    }
  },
}

export default validationUtils
