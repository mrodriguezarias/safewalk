import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"

import express, { Request, Response, NextFunction } from "express"
import { BAD_REQUEST } from "http-status-codes"
import "express-async-errors"

import BaseRouter from "./routes"
import logger from "@shared/Logger"
import { cookieProps } from "@shared/constants"

// Init express
const app = express()

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet())
}

// Add APIs
app.use("/api", BaseRouter)

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err)
  return res.status(BAD_REQUEST).json({
    error: err.message,
  })
})

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world")
})

app.get("/users", (req: Request, res: Response) => {
  const jwt = req.signedCookies[cookieProps.key]
  if (!jwt) {
    res.redirect("/")
  } else {
    console.log("/users")
  }
})

// Export express instance
export default app