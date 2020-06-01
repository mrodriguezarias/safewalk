import compression from "compression"
import express from "express"
import helmet from "helmet"
import cors from "cors"
import hpp from "hpp"
import morgan from "morgan"
import path from "path"
import cookieParser from "cookie-parser"

import envUtils, { env, nodeEnv } from "../utils/env"

const appConfig = {
  get host() {
    return envUtils.get(env.ServerHost)
  },
  get port() {
    return envUtils.get(env.ServerPort)
  },
  configure: (app) => {
    app.set("host", appConfig.host)
    app.set("port", appConfig.port)

    // HTTP headers
    app.disable("x-powered-by")

    // gzip compression
    app.use(compression())

    if (envUtils.get(env.NodeEnv) === nodeEnv.Production) {
      app.use(hpp())
      app.use(helmet())
      app.use(morgan("combined"))
      app.use(cors({ origin: appConfig.host, credentials: true }))
    } else {
      app.use(morgan("dev"))
      app.use(cors({ origin: true, credentials: true }))
    }

    // Parse JSON
    app.use(express.json())

    // Parse URL-encoded data
    app.use(express.urlencoded({ extended: true }))

    // Parse cookies
    app.use(cookieParser())

    // Serve static assets
    app.use("/assets", express.static(path.join(__dirname, "../../assets")))

    // Serve backend build
    app.use(
      express.static(path.join(__dirname, "../../../backend/build"), {
        index: false,
      }),
    )
  },
}

export default appConfig