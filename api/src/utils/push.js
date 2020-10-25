import { Expo } from "expo-server-sdk"
import { pushTypes } from "../../../shared/utils/push"
import userModel from "../models/user"
import contactService from "../services/contact"
import validationUtils from "./validation"

const getPushTokens = async (users, type) => {
  if (!Array.isArray(users)) {
    users = [users]
  }
  const pushTokens = new Set()
  for (let user of users) {
    if (validationUtils.objectId(user)) {
      user = await userModel.findById(user)
    }
    if (!user.notifications?.[type]) {
      continue
    }
    const token = user?.pushToken
    if (token && Expo.isExpoPushToken(token)) {
      pushTokens.add(token)
    }
  }
  return Array.from(pushTokens)
}

const pushUtils = {
  sendNotification: async ({ to, message, type, payload }) => {
    const pushTokens = await getPushTokens(to, type)
    const messages = pushTokens.map((token) => ({
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
  sendNotificationToCarers: async ({ userId, ...args }) => {
    const contacts = await contactService.getContactsForUser(userId, "carer")
    pushUtils.sendNotification({
      ...args,
      to: contacts,
    })
  },
}

export default pushUtils
export { pushTypes }
