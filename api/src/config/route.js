import path from "path"
import { Router } from "express"
import authRoute from "../routes/auth"
import userRoute from "../routes/user"
import contactRoute from "../routes/contact"
import nodeRoute from "../routes/node"
import pathRoute from "../routes/path"
import geoRoute from "../routes/geo"
import categoryRoute from "../routes/category"
import placeRoute from "../routes/place"
import walkRoute from "../routes/walk"
import zoneRoute from "../routes/zone"

const routeConfig = {
  routes: [
    authRoute,
    userRoute,
    contactRoute,
    nodeRoute,
    pathRoute,
    geoRoute,
    categoryRoute,
    placeRoute,
    walkRoute,
    zoneRoute,
  ],
  configure: (app) => {
    const apiRouter = new Router()
    for (const { path, configureRouter } of routeConfig.routes) {
      const router = new Router()
      configureRouter(router)
      apiRouter.use(path, router)
    }
    app.use("/api", apiRouter)
    const downloadRouter = new Router()
    downloadRouter.get("/", (req, res) => {
      const file = path.join(__dirname, "../../../app/build/safewalk.apk")
      res.download(file)
    })
    app.use("/download", downloadRouter)
    const staticRouter = new Router()
    const htmlFile = path.join(__dirname, "../../../backend/build/index.html")
    staticRouter.all("*", (req, res) => {
      res.sendFile(htmlFile)
    })
    app.use(staticRouter)
  },
}

export default routeConfig
