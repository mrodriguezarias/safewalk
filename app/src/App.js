import React, { useMemo, useEffect, useState, useCallback } from "react"
import { StatusBar } from "react-native"
import { useDispatch, useSelector } from "react-redux"
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
import navigationUtils from "./utils/navigation"
import notificationUtils from "./utils/notification"
import authActions from "./store/actions/auth"
import authController from "../../shared/controllers/auth"

const App = () => {
  const systemTheme = useColorScheme()
  const loading = useSelector((state) => state.app.loading)
  const userTheme = useSelector((state) => state.app.theme)
  const user = useSelector((state) => state.auth.user)
  const [preferredTheme, setPreferredTheme] = useState("light")
  const [theme, setTheme] = useState(LightTheme)
  const isConnected = useConnection()
  const hasPermission = usePermission()
  const navigationRef = navigationUtils.getRef()
  const dispatch = useDispatch()

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

  useEffect(() => {
    notificationUtils.register()
  }, [])

  keyboardUtils.init()

  const updateUser = useCallback(async (pushToken) => {
    const user = await authController.edit({ pushToken })
    dispatch(authActions.edit(user))
  }, [])

  useEffect(() => {
    const token = notificationUtils.getToken()
    if (user && token && user.pushToken !== token) {
      updateUser(token)
    }
  }, [user, updateUser])

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
        <NavigationContainer theme={theme} ref={navigationRef}>
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
