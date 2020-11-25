import dbUtils from "../shared/utils/db"
import userService from "../api/src/services/user"
import consoleUtils from "../shared/utils/console"
import _ from "lodash"

const DEFAULT_PASSWORD = "proyecto5504"
const PROFESSORS = [
  "gsalem",
  "sbalduzzi",
  "czunino",
  "dbresler",
  "fspadafora",
  "mcorvaro",
  "snovoa",
  "vferrari",
]

const addProfessors = {
  name: "add_professors",
  run: async () => {
    await dbUtils.connect(true)
    try {
      await addProfessors.uploadUsers()
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
  uploadUsers: async () => {
    const range = _.range(1, PROFESSORS.length + 1)
    for (const current of range) {
      consoleUtils.printProgress("Adding professor", current, PROFESSORS.length)
      const name = PROFESSORS[current - 1]
      await addProfessors.uploadUser(name)
    }
  },
  uploadUser: async (name) => {
    const userData = {
      name,
      password: DEFAULT_PASSWORD,
      canChangeLocation: true,
    }
    try {
      await userService.createUser(userData)
    } catch {}
  },
}

export default addProfessors
