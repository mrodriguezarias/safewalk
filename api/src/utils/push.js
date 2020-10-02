import { Expo } from "expo-server-sdk"

const pushUtils = {
  sendNotification: async (pushToken, message) => {
    const expo = new Expo()
    if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`)
      return
    }
    const payload = [
      {
        to: pushToken,
        sound: "default",
        body: message,
      },
    ]
    await expo.sendPushNotificationsAsync(payload)
  },
}

export default pushUtils
