import env from "./utils/env.util"
import App from "./App"
import IndexRoute from "./routes/index.route"
import UsersRoute from "./routes/users.route"
import AuthRoute from "./routes/auth.route"

env.load()

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute()])
app.listen()
