import mongoose from "mongoose"
import envUtils from "./env"

const options = {
  // useCreateIndex: true,
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
  // serverSelectionTimeoutMS: 3000,
  useMongoClient: true,
  family: 4,
}

const dbUtils = {
  connect: async (wait = false) => {
    let connected = false
    const doConnect = () => {
      const {
        MongoHost,
        MongoPort,
        MongoDatabase,
        MongoUser,
        MongoPassword,
      } = envUtils.getAll()
      const url = `mongodb://${MongoUser}:${MongoPassword}@${MongoHost}:${MongoPort}/${MongoDatabase}`
      mongoose.Promise = global.Promise
      mongoose.connect(url, options)
      mongoose.connection.on("error", function (error) {
        console.error(error)
      })
      mongoose.connection.once("open", (connection) => {
        console.info("Connected to database")
        connected = true
      })
      return mongoose.connection
    }
    if (!wait) {
      return doConnect()
    }
    return new Promise(function (resolve) {
      doConnect()
      ;(function waitForConnection() {
        if (connected) {
          return resolve()
        }
        setTimeout(waitForConnection, 100)
      })()
    })
  },
  disconnect: () => {
    mongoose.disconnect()
  },
}

export default dbUtils
