import bcrypt from "bcrypt"
import HttpStatus from "http-status-codes"
import userModel from "../models/user"
import HttpError from "../../../shared/errors/http"
import _ from "lodash"

const userService = {
  getUsers: async () => {
    return await userModel.find()
  },
  getUserById: async (userId) => {
    const user = await userModel.findById(userId)
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found")
    }
    return user
  },
  createUser: async (userData) => {
    if (_.isEmpty(userData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "User not provided")
    }

    const user = await userModel.findOne({ name: userData.name })
    if (user) {
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
  updateUser: async (userId, userData) => {
    if (_.isEmpty(userData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "User not provided")
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10)
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        ...userData,
      },
      { new: true },
    )
    if (!updatedUser) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found")
    }
    return updatedUser
  },
  deleteUser: async (userId) => {
    const user = await userModel.findByIdAndDelete(userId)
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found")
    }
    return user
  },
}

export default userService
