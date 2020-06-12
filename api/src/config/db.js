import mongoose from "mongoose"
import envUtils from "../../../shared/utils/env"

const dbConfig = {
  options: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 3000,
    family: 4,
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
    mongoose.connection.on("error", function (error) {
      console.error(error)
    })
    mongoose.connection.once("open", () => {
      console.info("Connected to database")
    })
  },
}

export default dbConfig
