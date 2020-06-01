import HttpStatus from "http-status-codes"

const errorConfig = {
  errorHandler: (error, req, res, next) => {
    console.error(error.stack)
    const status =
      error.status || error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || "Internal Server Error"
    error = {
      ...error,
      status,
      message,
    }
    return res.status(status).json(error)
  },
  configure: (app) => {
    app.use(errorConfig.errorHandler)
  },
}

export default errorConfig
