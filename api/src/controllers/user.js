import HttpStatus from "http-status-codes"
import userService from "../services/user"

const userController = {
  getUsers: async (req, res, next) => {
    try {
      const response = await userService.getUsers()
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  getUserById: async (req, res, next) => {
    const userId = req.params.id
    try {
      const response = await userService.getUserById(userId)
      res.status(HttpStatus.OK).json(response)
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
}

export default userController
