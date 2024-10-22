import envUtils from "../../shared/utils/env"
import cacheUtils from "../../shared/utils/cache"
import express from "express"
import http from "http"

import appConfig from "./config/app"
import routeConfig from "./config/route"
import dbConfig from "./config/db"
import errorConfig from "./config/error"

envUtils.load({
  platform: "api",
  libs: {
    yargs: require("yargs"),
    dotenv: require("dotenv"),
  },
})

const app = express()
const server = http.createServer(app)

appConfig.configure(app)
routeConfig.configure(app)
errorConfig.configure(app)
dbConfig.configure()

server.listen(appConfig.port, appConfig.host, (error) => {
  if (error) {
    console.error("Server error:", error)
  } else {
    console.info(`Server listening @ ${appConfig.host}:${appConfig.port}`)
  }
})

server.on("listening", () => {
  cacheUtils.load()
})
