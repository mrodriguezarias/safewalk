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
import env, { Env, NodeEnv } from "./utils/env.util"

class App {
  public app: express.Application
  public port: number
  public env: NodeEnv

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = env.get(Env.ServerPort)
    this.env = env.get(Env.NodeEnv)

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
    if (this.env === NodeEnv.Production) {
      this.app.use(hpp())
      this.app.use(helmet())
      this.app.use(logger("combined"))
      this.app.use(cors({ origin: env.get(Env.ServerHost), credentials: true }))
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
      MongoHost,
      MongoPort,
      MongoUser,
      MongoPassword,
      MongoDatabase,
    } = env.getAll()
    const options = {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }

    mongoose.connect(
      `mongodb://${MongoUser}:${MongoPassword}@${MongoHost}:${MongoPort}/${MongoDatabase}?authSource=admin`,
      { ...options },
    )
  }
}

export default App
