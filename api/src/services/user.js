import bcrypt from "bcrypt"
import HttpStatus from "http-status-codes"
import userModel from "../models/user"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

const userService = {
  getUsers: async (filter = {}, range, sort) => {
    const query = userModel.find(filter)
    const count = await userModel.estimatedDocumentCount()
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    const users = _.map(sorted, (user) => _.omit(user.toJSON(), "password"))
    return { users, contentRangeHeader }
  },
  getUserById: async (userId) => {
    let user = await userModel.findById(userId)
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found")
    }
    user = _.omit(user.toJSON(), "password")
    return user
  },
  createUser: async (userData) => {
    if (_.isEmpty(userData) || !userData.name) {
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

    userData = _.omit(userData, "id")
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
