import HttpStatus from "http-status-codes"
import authService from "../services/auth"

const authController = {
  signUp: async (req, res, next) => {
    const userData = req.body
    try {
      const signUpUserData = await authService.signUp(userData)
      res
        .status(HttpStatus.CREATED)
        .json({ data: signUpUserData, message: "signup" })
    } catch (error) {
      next(error)
    }
  },
  logIn: async (req, res, next) => {
    const userData = req.body
    try {
      const { user, token } = await authService.logIn(userData)
      res.cookie("auth", token)
      res.status(HttpStatus.OK).json({ data: user, message: "login" })
    } catch (error) {
      next(error)
    }
  },
  logOut: async (req, res, next) => {
    const userData = req.user
    try {
      const user = await authService.logOut(userData)
      res.clearCookie("auth")
      res.status(HttpStatus.OK).json({ data: user, message: "logout" })
    } catch (error) {
      next(error)
    }
  },
}

export default authController
