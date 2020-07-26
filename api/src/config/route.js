import path from "path"
import { Router } from "express"
import authRoute from "../routes/auth"
import userRoute from "../routes/user"
import carerRoute from "../routes/carer"
import nodeRoute from "../routes/node"
import pathRoute from "../routes/path"

const routeConfig = {
  routes: [authRoute, userRoute, carerRoute, nodeRoute, pathRoute],
  configure: (app) => {
    const apiRouter = new Router()
    for (const { path, configureRouter } of routeConfig.routes) {
      const router = new Router()
      configureRouter(router)
      apiRouter.use(path, router)
    }
    app.use("/api", apiRouter)
    const staticRouter = new Router()
    const htmlFile = path.join(__dirname, "../../../backend/build/index.html")
    staticRouter.all("*", (req, res) => {
      res.sendFile(htmlFile)
    })
    app.use(staticRouter)
  },
}

export default routeConfig
