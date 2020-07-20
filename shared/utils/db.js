import mongoose from "mongoose"
import envUtils from "./env"

const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  serverSelectionTimeoutMS: 3000,
  family: 4,
}

const dbUtils = {
  connect: () => {
    const {
      MongoHost,
      MongoPort,
      MongoDatabase,
      MongoUser,
      MongoPassword,
      MongoCluster,
    } = envUtils.getAll()
    const [schema, params, port] = MongoCluster
      ? ["mongodb+srv", "retryWrites=true&w=majority", ""]
      : ["mongodb", "authSource=admin", `:${MongoPort}`]
    const url = `${schema}://${MongoUser}:${MongoPassword}@${MongoHost}${port}/${MongoDatabase}?${params}`
    mongoose.connect(url, options)
    mongoose.connection.on("error", function (error) {
      console.error(error)
    })
    mongoose.connection.once("open", (connection) => {
      console.info("Connected to database")
    })
    return mongoose.connection
  },
  disconnect: () => {
    mongoose.disconnect()
  },
}

export default dbUtils
