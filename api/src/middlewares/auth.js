import jwt from "jsonwebtoken"
import HttpStatus from "http-status-codes"
import HttpError from "../../../shared/errors/http"
import userModel from "../models/user"
import envUtils, { env } from "../../../shared/utils/env"
import _ from "lodash"

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
    const token = req.headers.authorization
    const secret = envUtils.get(env.JwtSecret)
    try {
      if (!token) {
        throw new Error()
      }
      const verificationResponse = jwt.verify(token, secret)
      const userId = verificationResponse._id
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
