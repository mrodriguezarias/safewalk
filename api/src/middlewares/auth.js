import jwt from "jsonwebtoken"
import HttpStatus from "http-status-codes"
import HttpError from "../../../shared/errors/http"
import userModel from "../models/user"
import envUtils, { env } from "../../../shared/utils/env"

const authMiddleware = (admin = false) => {
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
      if (admin && !user.admin && req.params.id !== userId) {
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
