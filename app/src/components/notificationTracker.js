import Constants from "expo-constants"
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"
import { useState, useEffect, useRef, useCallback } from "react"
import { Platform, AppState } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import authController from "../../../shared/controllers/auth"
import { pushTypes } from "../../../shared/utils/push"
import authActions from "../store/actions/auth"

const registerForPushNotifications = async () => {
  if (!Constants.isDevice) {
    return null
  }

  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
  )
  let finalStatus = existingStatus
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!")
    return
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  return token
}

const NotificationTracker = ({ navigation }) => {
  const [expoPushToken, setExpoPushToken] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const appState = useRef()
  const dispatch = useDispatch()

  const updateUser = useCallback(async (pushToken) => {
    const user = await authController.edit({ pushToken })
    dispatch(authActions.edit(user))
  }, [])

  useEffect(() => {
    if (user && expoPushToken && user.pushToken !== expoPushToken) {
      updateUser(expoPushToken)
    }
  }, [user, expoPushToken, updateUser])

  useEffect(() => {
    registerForPushNotifications().then((token) => setExpoPushToken(token))

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      ({ notification }) => handleNotificationPressed(notification),
    )

    AppState.addEventListener("change", handleAppStateChange)
    Notifications.setNotificationHandler(handleNotification)

    return () => {
      responseListener.remove()
      AppState.removeEventListener("change", handleAppStateChange)
    }
  }, [])

  const handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState
  }

  const handleNotification = (notification) => {
    if (appState.current === "active" && notification.origin === "received") {
      Notifications.dismissNotificationAsync(notification.notificationId)
    }
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }
  }

  const handleNotificationPressed = (notification) => {
    const { type } = notification.request.content.data
    const handlers = {
      [pushTypes.invite]: handleInvite,
      [pushTypes.alert]: handleAlert,
    }
    if (type in handlers) {
      handlers[type](notification)
    }
  }

  const handleInvite = () => {
    navigation.navigate("User", {
      screen: "Requests",
      initial: false,
    })
  }

  const handleAlert = () => {
    console.info("TODO: handle alert")
  }

  return null
}

export default NotificationTracker
