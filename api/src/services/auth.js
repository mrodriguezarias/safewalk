import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import _ from "lodash"

import HttpError from "../../../shared/errors/http"
import HttpStatus from "http-status-codes"
import userModel from "../models/user"
import envUtils, { env } from "../../../shared/utils/env"
import userService from "./user"

const getUserAndToken = (dbUser) => {
  const user = _.isPlainObject(dbUser) ? dbUser : dbUser.toJSON()
  const payload = { _id: user.id }
  const secret = envUtils.get(env.JwtSecret)
  const token = jwt.sign(payload, secret)
  return { user, token }
}

const authService = {
  signUp: async (userData) => {
    const user = await userService.createUser(userData)
    return getUserAndToken(user)
  },
  logIn: async ({ name, password, shouldBeAdmin }) => {
    const user = await userModel.findOne({ name })
    if (!user) {
      throw new HttpError(HttpStatus.CONFLICT, "Usuario inexistente")
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      user.loginAttempts = Math.min(user.loginAttempts + 1, 2)
      if (user.loginAttempts === 2) {
        user.loginAttempts = 0
        user.blocked = true
      }
      await user.save()
    }

    if (user.blocked) {
      throw new HttpError(HttpStatus.CONFLICT, "Usuario bloqueado")
    }

    if (!passwordMatches) {
      throw new HttpError(HttpStatus.CONFLICT, "Contraseña incorrecta")
    }

    if (shouldBeAdmin && !user.admin) {
      throw new HttpError(HttpStatus.FORBIDDEN, "Usuario no autorizado")
    }

    user.loginAttempts = 0
    await user.save()
    return getUserAndToken(user)
  },
  logOut: async (userId) => {
    await userService.updateUser(userId, {
      pushToken: null,
    })
  },
}

export default authService
