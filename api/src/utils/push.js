import { Expo } from "expo-server-sdk"
import _ from "lodash"
import { pushTypes } from "../../../shared/utils/push"

const pushUtils = {
  sendNotification: async ({ to, message, type, payload }) => {
    if (!Array.isArray(to)) {
      to = [to]
    }
    to = _.uniq(to)
    const messages = to
      .filter((token) => {
        const valid = token && Expo.isExpoPushToken(token)
        if (!valid) {
          console.error(`Push token ${token} is not a valid Expo push token`)
        }
        return valid
      })
      .map((token) => ({
        to: token,
        sound: "default",
        body: message,
        data: {
          type,
          payload,
        },
      }))
    const expo = new Expo()
    await expo.sendPushNotificationsAsync(messages)
  },
}

export default pushUtils
export { pushTypes }
