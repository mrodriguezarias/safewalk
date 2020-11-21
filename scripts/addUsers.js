import dbUtils from "../shared/utils/db"
import requestUtils from "../shared/utils/request"
import userService from "../api/src/services/user"
import consoleUtils from "../shared/utils/console"
import _ from "lodash"

const USERS_TO_ADD = 50
const DEFAULT_PASSWORD = "safepass"
const GENERATOR_API = "https://api.namefake.com/spanish-argentina/random"

const addUsers = {
  name: "add_users",
  run: async () => {
    await dbUtils.connect(true)
    try {
      await addUsers.uploadUsers()
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
  uploadUsers: async () => {
    const range = _.range(1, USERS_TO_ADD + 1)
    for (const current of range) {
      consoleUtils.printProgress("Adding user", current, USERS_TO_ADD)
      const name = await addUsers.getRandomName()
      await addUsers.uploadUser(name)
    }
  },
  getRandomName: async () => {
    const { username } = await requestUtils.get(GENERATOR_API)
    return username
  },
  uploadUser: async (name) => {
    const userData = {
      name,
      password: DEFAULT_PASSWORD,
    }
    try {
      await userService.createUser(userData)
    } catch {}
  },
}

export default addUsers
