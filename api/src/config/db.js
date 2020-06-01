import mongoose from "mongoose"
import envUtils from "../utils/env"

const dbConfig = {
  options: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  configure: () => {
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
    mongoose.connect(url, dbConfig.options)
    const connection = mongoose.connection
    connection.once("open", () => {
      console.log("Connected to database")
    })
  },
}

export default dbConfig
