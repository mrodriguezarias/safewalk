import HttpStatus from "http-status-codes"
import HttpError from "../../../shared/errors/http"
import userModel from "../models/user"
import _ from "lodash"
import reqUtils from "../utils/req"

const getUserIdFromPath = async (req, path) => {
  const [type, ...rel] = path.split(".")
  let obj
  if (type === "req") {
    obj = req
  } else {
    const model = require(`../models/${type}`).default
    obj = await model.findById(req.params.id)
  }
  return String(_.get(obj, rel))
}

const authMiddleware = (admin = false, userIdPath = "req.params.id") => {
  return async (req, res, next) => {
    try {
      const userId = reqUtils.getLoggedUserId(req)
      const user = await userModel.findById(userId)
      if (!user) {
        throw new Error()
      }
      const userIdFromPath = await getUserIdFromPath(req, userIdPath)
      if (admin && !user.admin && userIdFromPath !== userId) {
        next(new HttpError(HttpStatus.FORBIDDEN, "Unauthorized"))
        return
      }
      req.user = user
      next()
    } catch (error) {
      next(new HttpError(HttpStatus.UNAUTHORIZED, "Unauthenticated"))
    }
  }
}

export default authMiddleware
