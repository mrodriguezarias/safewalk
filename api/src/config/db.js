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
    } = envUtils.getAll()
    const url = `mongodb://${MongoUser}:${MongoPassword}@${MongoHost}:${MongoPort}/${MongoDatabase}?authSource=admin`
    mongoose.connect(url, dbConfig.options)
    const connection = mongoose.connection
    connection.once("open", () => {
      console.log("Connected to database")
    })
  },
}

export default dbConfig
