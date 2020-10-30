import React, { useMemo, useEffect, useState } from "react"
import { StatusBar } from "react-native"
import { useSelector } from "react-redux"
import {
  Provider as PaperProvider,
  DefaultTheme as PaperLightTheme,
  DarkTheme as PaperDarkTheme,
} from "react-native-paper"
import {
  NavigationContainer,
  DefaultTheme as LightTheme,
  DarkTheme,
} from "@react-navigation/native"
import { AppearanceProvider, useColorScheme } from "react-native-appearance"
import _ from "lodash"

import getTheme from "./theme"
import LoadingScreen from "./screens/loading"
import NoConnectionScreen from "./screens/noConnection"
import NoPermissionScreen from "./screens/noPermission"
import MainScreen from "./screens/main"
import useConnection from "./hooks/useConnection"
import usePermission from "./hooks/usePermission"
import keyboardUtils from "./utils/keyboard"

const App = () => {
  const systemTheme = useColorScheme()
  const loading = useSelector((state) => state.app.loading)
  const userTheme = useSelector((state) => state.app.theme)
  const [preferredTheme, setPreferredTheme] = useState("light")
  const [theme, setTheme] = useState(LightTheme)
  const isConnected = useConnection()
  const hasPermission = usePermission()

  useEffect(() => {
    if (userTheme === "system") {
      setPreferredTheme(systemTheme)
    } else {
      setPreferredTheme(userTheme)
    }
  }, [systemTheme, userTheme])

  useEffect(() => {
    setTheme(preferredTheme === "dark" ? DarkTheme : LightTheme)
  }, [preferredTheme])

  keyboardUtils.init()

  const paperTheme = useMemo(() => {
    const t = theme.dark ? PaperDarkTheme : PaperLightTheme
    const preferredTheme = theme.dark ? "dark" : "light"
    const customTheme = getTheme(preferredTheme)
    return {
      ...t,
      roundness: 10,
      colors: {
        ...t.colors,
        ...theme.colors,
        ...customTheme,
      },
    }
  }, [theme])

  if (loading || !_.isBoolean(isConnected) || !_.isBoolean(hasPermission)) {
    return <LoadingScreen />
  }

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        barStyle={preferredTheme === "dark" ? "light-content" : "dark-content"}
      />
      {!isConnected ? (
        <NoConnectionScreen />
      ) : !hasPermission ? (
        <NoPermissionScreen />
      ) : (
        <NavigationContainer theme={theme}>
          <MainScreen />
        </NavigationContainer>
      )}
    </PaperProvider>
  )
}

const AppContainer = () => (
  <AppearanceProvider>
    <App />
  </AppearanceProvider>
)

export default AppContainer
