import jwt from "jsonwebtoken"
import HttpStatus from "http-status-codes"
import HttpError from "../errors/HttpError"
import userModel from "../models/user"
import envUtils, { env } from "../utils/env"

const authMiddleware = (admin = false) => {
  return async (req, res, next) => {
    const cookies = req.cookies
    const secret = envUtils.get(env.JwtSecret)
    try {
      if (!cookies || !cookies.auth) {
        throw new Error()
      }
      const verificationResponse = jwt.verify(cookies.auth, secret)
      const userId = verificationResponse._id
      const user = await userModel.findById(userId)
      if (!user) {
        throw new Error()
      }
      if (admin && !user.admin && req.params.id !== userId) {
        throw new Error("Must be admin")
      }
      req.user = user
      next()
    } catch (error) {
      next(
        new HttpError(
          HttpStatus.UNAUTHORIZED,
          error.message || "Unauthenticated",
        ),
      )
    }
  }
}

export default authMiddleware
