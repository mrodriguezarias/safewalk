import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import HttpError from "../errors/HttpError"
import HttpStatus from "http-status-codes"
import userModel from "../models/user"
import envUtils, { env } from "../utils/env"

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
  logIn: async (userData) => {
    const user = await userModel.findOne({ name: userData.name })
    if (!user) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        `Name ${userData.name} not found`,
      )
    }

    const passwordMatches = await bcrypt.compare(
      userData.password,
      user.password,
    )
    if (!passwordMatches) {
      throw new HttpError(409, "Incorrect password")
    }

    const payload = { _id: user._id }
    const secret = envUtils.get(env.JwtSecret)
    const token = jwt.sign(payload, secret)

    return { user, token }
  },
  logOut: async (userData) => {
    const user = await userModel.findById(userData._id)
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found")
    }
    return user
  },
}

export default authService
