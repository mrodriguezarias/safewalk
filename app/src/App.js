import React, { useMemo, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { StatusBar } from "expo-status-bar"
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

import LoadingScreen from "./screens/loading"
import MainScreen from "./screens/main"

const App = () => {
  const systemTheme = useColorScheme()
  const loading = useSelector((state) => state.app.loading)
  const userTheme = useSelector((state) => state.app.theme)
  const [preferredTheme, setPreferredTheme] = useState("light")
  const [theme, setTheme] = useState(LightTheme)

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

  const paperTheme = useMemo(() => {
    const t = theme.dark ? PaperDarkTheme : PaperLightTheme
    return {
      ...t,
      roundness: 10,
      colors: {
        ...t.colors,
        ...theme.colors,
        surface: theme.dark ? "#027961" : "#03CEA4",
        primary: theme.dark ? "#1573B7" : "#1A8FE3",
        accent: theme.dark ? "#7D5BA6" : "#B5A2CD",
      },
    }
  }, [theme])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={preferredTheme} />
      <NavigationContainer theme={theme}>
        <MainScreen />
      </NavigationContainer>
    </PaperProvider>
  )
}

const AppContainer = () => (
  <AppearanceProvider>
    <App />
  </AppearanceProvider>
)

export default AppContainer
