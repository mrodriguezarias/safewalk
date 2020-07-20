import dbUtils from "../../../shared/utils/db"

const dbConfig = {
  configure: () => {
    dbUtils.connect()
  },
}

export default dbConfig
