import path from "path"
import { Router } from "express"
import authRoute from "../routes/auth"
import userRoute from "../routes/user"

const routeConfig = {
  routes: [authRoute, userRoute],
  configure: (app) => {
    const apiRouter = new Router()
    for (const route of routeConfig.routes) {
      apiRouter.use("/", route)
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
