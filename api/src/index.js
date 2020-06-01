import envUtils from "./utils/env"
import express from "express"
import http from "http"

import appConfig from "./config/app"
import routeConfig from "./config/route"
import dbConfig from "./config/db"
import errorConfig from "./config/error"

envUtils.load()

const app = express()
const server = http.createServer(app)

appConfig.configure(app)
routeConfig.configure(app)
errorConfig.configure(app)
dbConfig.configure()

server.listen(appConfig.port, appConfig.host, (error) => {
  if (error) {
    console.log("Server error:", error)
  } else {
    console.log(`Server listening @ ${appConfig.host}:${appConfig.port}`)
  }
})
