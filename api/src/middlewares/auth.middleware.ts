import { NextFunction, Response } from "express"
import jwt from "jsonwebtoken"
import HttpException from "../exceptions/HttpException"
import {
  DataStoredInToken,
  RequestWithUser,
} from "../interfaces/auth.interface"
import userModel from "../models/users.model"
import env from "../utils/env.util"

async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  const cookies = req.cookies

  if (cookies && cookies.Authorization) {
    const secret = env.getString("JWT_SECRET")

    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret,
      ) as DataStoredInToken
      const userId = verificationResponse._id
      const findUser = await userModel.findById(userId)

      if (findUser) {
        req.user = findUser
        next()
      } else {
        next(new HttpException(401, "Wrong authentication token"))
      }
    } catch (error) {
      next(new HttpException(401, "Wrong authentication token"))
    }
  } else {
    next(new HttpException(404, "Authentication token missing"))
  }
}

export default authMiddleware
