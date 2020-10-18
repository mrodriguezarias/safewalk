import { Expo } from "expo-server-sdk"
import _ from "lodash"
import { pushTypes } from "../../../shared/utils/push"

const pushUtils = {
  sendNotification: async ({ to, message, type }) => {
    if (!Array.isArray(to)) {
      to = [to]
    }
    to = _.uniq(to)
    const payload = to
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
        },
      }))
    const expo = new Expo()
    await expo.sendPushNotificationsAsync(payload)
  },
}

export default pushUtils
export { pushTypes }
