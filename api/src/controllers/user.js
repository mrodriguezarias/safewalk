import HttpStatus from "http-status-codes"
import userService from "../services/user"

const userController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await userService.getUsers()
      res.status(HttpStatus.OK).json({ data: users, message: "findAll" })
    } catch (error) {
      next(error)
    }
  },
  getUserById: async (req, res, next) => {
    const userId = req.params.id
    try {
      const user = await userService.getUserById(userId)
      res.status(HttpStatus.OK).json({ data: user, message: "findOne" })
    } catch (error) {
      next(error)
    }
  },
  createUser: async (req, res, next) => {
    const userData = req.body
    try {
      const user = await userService.createUser(userData)
      res.status(HttpStatus.CREATED).json({ data: user, message: "created" })
    } catch (error) {
      next(error)
    }
  },
  updateUser: async (req, res, next) => {
    const userId = req.params.id
    const userData = req.body
    try {
      const user = await userService.updateUser(userId, userData)
      res.status(HttpStatus.OK).json({ data: user, message: "updated" })
    } catch (error) {
      next(error)
    }
  },
  deleteUser: async (req, res, next) => {
    const userId = req.params.id
    try {
      const userData = await userService.deleteUser(userId)
      res.status(200).json({ data: userData, message: "deleted" })
    } catch (error) {
      next(error)
    }
  },
}

export default userController
