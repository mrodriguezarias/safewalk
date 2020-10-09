import bcrypt from "bcrypt"
import HttpStatus from "http-status-codes"
import userModel from "../models/user"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

const userService = {
  getUsers: async (filter = {}, range, sort) => {
    filter = dbUtils.transformQueryFilter(filter)
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
        `El usuario ${userData.name} ya existe`,
      )
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const newUser = await userModel.create({
      ...userData,
      password: hashedPassword,
    })
    return newUser.toJSON()
  },
  updateUser: async (userId, userData) => {
    if (_.isEmpty(userData)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "User not provided")
    }

    const user = await userModel.findById(userId)
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found")
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10)
    }

    if (userData.name && userData.name !== user.name) {
      const existing = await userModel.findOne({ name: userData.name })
      if (existing) {
        throw new HttpError(
          HttpStatus.CONFLICT,
          `El usuario ${userData.name} ya existe`,
        )
      }
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
  searchUsers: async (query) => {
    if (_.isEmpty(query)) {
      return []
    }
    query = new RegExp(`^${query}`, "i")
    let users = await userModel.find({ name: query })
    users = _.filter(users, (user) => !user.admin)
    users = _.map(users, (user) => _.pick(user.toJSON(), ["id", "name"]))
    return users
  },
}

export default userService
