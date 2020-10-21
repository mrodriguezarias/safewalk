import HttpStatus from "http-status-codes"
import userService from "../services/user"
import reqUtils from "../utils/req"

const userController = {
  getUsers: async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query
      const { users, contentRangeHeader } = await userService.getUsers(
        filter,
        range,
        sort,
      )
      res.header("Content-Range", contentRangeHeader)
      res.status(HttpStatus.OK).json(users)
    } catch (error) {
      next(error)
    }
  },
  getUserById: async (req, res, next) => {
    const userId = req.params.id
    const loggedId = reqUtils.getLoggedUserId(req)
    try {
      const user = await userService.getUserById(userId, loggedId)
      res.status(HttpStatus.OK).json(user)
    } catch (error) {
      next(error)
    }
  },
  createUser: async (req, res, next) => {
    const userData = req.body
    try {
      const response = await userService.createUser(userData)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updateUser: async (req, res, next) => {
    const userId = req.params.id
    const userData = req.body
    try {
      const response = await userService.updateUser(userId, userData)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deleteUser: async (req, res, next) => {
    const userId = req.params.id
    try {
      const response = await userService.deleteUser(userId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  searchUsers: async (req, res, next) => {
    const { query } = req.query
    const userId = reqUtils.getLoggedUserId(req)
    try {
      let users = await userService.searchUsers(query)
      users = users.filter(({ id }) => id !== userId)
      res.status(HttpStatus.OK).json(users)
    } catch (error) {
      next(error)
    }
  },
}

export default userController
