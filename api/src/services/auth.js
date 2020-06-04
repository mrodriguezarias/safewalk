import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import HttpError from "../../../shared/errors/http"
import HttpStatus from "http-status-codes"
import userModel from "../models/user"
import envUtils, { env } from "../../../shared/utils/env"

const authService = {
  signUp: async (userData) => {
    const preexistingUser = await userModel.findOne({ name: userData.name })
    if (preexistingUser) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        `User ${userData.name} already exists`,
      )
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const newUser = await userModel.create({
      ...userData,
      password: hashedPassword,
    })

    return newUser
  },
  logIn: async ({ name, password, shouldBeAdmin }) => {
    const user = await userModel.findOne({ name })
    if (!user) {
      throw new HttpError(HttpStatus.CONFLICT, `Name ${name} not found`)
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      throw new HttpError(HttpStatus.CONFLICT, "Incorrect password")
    }

    if (shouldBeAdmin && !user.admin) {
      throw new HttpError(HttpStatus.FORBIDDEN, "User is not admin")
    }

    const payload = { _id: user._id }
    const secret = envUtils.get(env.JwtSecret)
    const token = jwt.sign(payload, secret)

    return { user, token }
  },
}

export default authService
