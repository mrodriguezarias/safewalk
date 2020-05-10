import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import hpp from "hpp"
import mongoose from "mongoose"
import logger from "morgan"
import path from "path"

import Routes from "./interfaces/routes.interface"
import errorMiddleware from "./middlewares/error.middleware"
import env from "./utils/env.util"

class App {
  public app: express.Application
  public port: number
  public env: string

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = env.getNumber("SERVER_PORT")
    this.env = env.getString("NODE_ENV")

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeErrorHandling()
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening on port ${this.port}`)
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    if (this.env) {
      this.app.use(hpp())
      this.app.use(helmet())
      this.app.use(logger("combined"))
      this.app.use(cors({ origin: "your.domain.com", credentials: true }))
    } else {
      this.app.use(logger("dev"))
      this.app.use(cors({ origin: true, credentials: true }))
    }

    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use("/assets", express.static(path.join(__dirname, "../assets")))
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private connectToDatabase() {
    const {
      MONGO_HOST,
      MONGO_PORT,
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_DATABASE,
    } = env.getAll()
    const options = {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }

    mongoose.connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`,
      { ...options },
    )
  }
}

export default App
