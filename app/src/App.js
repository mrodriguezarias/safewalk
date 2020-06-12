import React from "react"
import { useSelector } from "react-redux"

import LoadingScreen from "./screens/loading"
import AuthScreen from "./screens/auth"
import MainScreen from "./screens/main"

const App = () => {
  const loading = useSelector((state) => state.app.loading)
  const loggedIn = useSelector((state) => state.auth.logged)

  if (loading) {
    return <LoadingScreen />
  }
  if (!loggedIn) {
    return <AuthScreen />
  }
  return <MainScreen />
}

export default App
