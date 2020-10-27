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
import MainScreen from "./screens/main"
import useInternetReachable from "./hooks/useInternetReachable"
import keyboardUtils from "./utils/keyboard"

const App = () => {
  const systemTheme = useColorScheme()
  const loading = useSelector((state) => state.app.loading)
  const userTheme = useSelector((state) => state.app.theme)
  const [preferredTheme, setPreferredTheme] = useState("light")
  const [theme, setTheme] = useState(LightTheme)
  const internetReachable = useInternetReachable()

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

  if (loading || !_.isBoolean(internetReachable)) {
    return <LoadingScreen />
  }

  const NavContainer = () => (
    <NavigationContainer theme={theme}>
      <MainScreen />
    </NavigationContainer>
  )

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        barStyle={preferredTheme === "dark" ? "light-content" : "dark-content"}
      />
      {internetReachable === false ? <NoConnectionScreen /> : <NavContainer />}
    </PaperProvider>
  )
}

const AppContainer = () => (
  <AppearanceProvider>
    <App />
  </AppearanceProvider>
)

export default AppContainer
