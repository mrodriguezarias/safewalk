import React from "react"
import ReactDOM from "react-dom"

import "./index.css"
import App from "./App"
import envUtils from "../../shared/utils/env"

envUtils.validateAll()

ReactDOM.render(<App />, document.getElementById("root"))
