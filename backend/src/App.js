import React, { useMemo } from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { createMuiTheme } from "@material-ui/core/styles"
import { Admin, Resource, Login } from "react-admin"

import authProvider from "./providers/auth"
import dataProvider from "./providers/data"
import Dashboard from "./dashboard"

const LoginPage = () => (
  <Login backgroundImage="https://source.unsplash.com/1600x900/?kitten" />
)

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  )
  return (
    <Admin
      loginPage={LoginPage}
      theme={theme}
      authProvider={authProvider}
      dataProvider={dataProvider}
      dashboard={Dashboard}
    >
      <Resource />
    </Admin>
  )
}

export default App
