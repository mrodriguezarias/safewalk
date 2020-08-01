import dbUtils from "../shared/utils/db"
import userService from "../api/src/services/user"

const userData = {
  name: "admin",
  password: "gamaroli",
  admin: true,
}

const createAdminUser = {
  name: "create_admin_user",
  run: async () => {
    dbUtils.connect()
    try {
      await userService.createUser(userData)
      console.info("Created admin user")
      console.info("Username:", userData.name)
      console.info("Password:", userData.password)
    } catch (error) {
      if (error.status === 409) {
        console.error("Error: user already exists")
      } else {
        throw error
      }
    } finally {
      dbUtils.disconnect()
    }
  },
}

export default createAdminUser
