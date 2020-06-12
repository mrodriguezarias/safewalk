import React from "react"
import ReactDOM from "react-dom"

import "./index.css"
import App from "./App"
import envUtils from "../../shared/utils/env"

envUtils.load()

ReactDOM.render(<App />, document.getElementById("root"))
