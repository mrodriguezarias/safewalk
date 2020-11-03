import Constants from "expo-constants"
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"
import { Platform } from "react-native"
import { pushTypes } from "../../../shared/utils/push"
import navigationUtils from "../utils/navigation"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  })
}

const handleNotificationPressed = ({ notification }) => {
  const { type, payload } = notification.request.content.data
  const handlers = {
    [pushTypes.invite]: handleInvite,
    [pushTypes.alert]: handleAlert,
    [pushTypes.startWalk]: handleAlert,
    [pushTypes.safeArrival]: handleAlert,
    [pushTypes.rogueWalk]: handleAlert,
  }
  if (type in handlers) {
    handlers[type](payload)
  }
}

Notifications.addNotificationResponseReceivedListener(handleNotificationPressed)

const handleInvite = () => {
  navigationUtils.navigate("Contacts", {
    screen: "Requests",
    initial: false,
  })
}

const handleAlert = async ({ walkId, contactId }) => {
  navigationUtils.navigate("Contacts", {
    screen: "WalkDetail",
    initial: false,
    params: { walkId, contactId },
  })
}

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
    return
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data
  return token
}

const notificationUtils = {
  register: async () => {
    const token = await registerForPushNotifications()
    notificationUtils._token = token
  },
  getToken: () => {
    return notificationUtils._token
  },
}

notificationUtils._token = null

export default notificationUtils
