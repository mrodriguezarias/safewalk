import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import envUtils from "../../shared/utils/env"
import App from "./App"

envUtils.load()

ReactDOM.render(<App />, document.getElementById("root"))
