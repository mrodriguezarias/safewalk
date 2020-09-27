import jwt from "jsonwebtoken"
import HttpStatus from "http-status-codes"
import HttpError from "../../../shared/errors/http"
import envUtils, { env } from "../../../shared/utils/env"

const reqUtils = {
  getLoggedUserId: (req) => {
    const token = req?.headers?.authorization
    if (!token) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthenticated")
    }
    const secret = envUtils.get(env.JwtSecret)
    const verificationResponse = jwt.verify(token, secret)
    const userId = verificationResponse._id
    return userId
  },
}

export default reqUtils
