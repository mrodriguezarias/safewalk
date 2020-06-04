import HttpStatus from "http-status-codes"
import authService from "../services/auth"

const authController = {
  signUp: async (req, res, next) => {
    const userData = req.body
    try {
      const response = await authService.signUp(userData)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  logIn: async (req, res, next) => {
    const userData = req.body
    try {
      const response = await authService.logIn(userData)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default authController
