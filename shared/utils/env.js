import _ from "lodash"
import EnvironmentError from "../errors/environment"

const env = {
  NodeEnv: "NODE_ENV",
  Host: "HOST",
  Port: "PORT",
  Url: "URL",
  MongoHost: "MONGO_HOST",
  MongoPort: "MONGO_PORT",
  MongoUser: "MONGO_USER",
  MongoPassword: "MONGO_PASSWORD",
  MongoDatabase: "MONGO_DATABASE",
  MongoCluster: "MONGO_CLUSTER",
  JwtSecret: "JWT_SECRET",
}

const nodeEnv = {
  Local: "local",
  Dev: "dev",
  Test: "test",
  Prod: "prod",
}

const types = {
  NodeEnv: "NodeEnv",
  String: "String",
  Number: "Number",
  Boolean: "Boolean",
}

let repo = {}

const options = [
  {
    name: env.NodeEnv,
    required: true,
    type: types.NodeEnv,
  },
  {
    name: env.Host,
    required: true,
    type: types.String,
  },
  {
    name: env.Port,
    required: true,
    type: types.Number,
  },
  {
    name: env.Url,
    required: true,
    type: types.String,
  },
  {
    name: env.MongoHost,
    required: true,
    type: types.String,
  },
  {
    name: env.MongoPort,
    required: false,
    type: types.Number,
    default: 27017,
  },
  {
    name: env.MongoUser,
    required: false,
    type: types.String,
    default: "root",
  },
  {
    name: env.MongoPassword,
    required: true,
    type: types.String,
  },
  {
    name: env.MongoDatabase,
    required: false,
    type: types.String,
    default: "safewalk",
  },
  {
    name: env.MongoCluster,
    required: false,
    type: types.Boolean,
    default: false,
  },
  {
    name: env.JwtSecret,
    required: true,
    type: types.String,
  },
]

const typesMap = new Map([
  [
    types.String,
    {
      validate: (value) => _.isString(value),
      cast: (value) => value,
    },
  ],
  [
    types.Number,
    {
      validate: (value) => _.isFinite(_.parseInt(value)),
      cast: (value) => _.parseInt(value),
    },
  ],
  [
    types.Boolean,
    {
      validate: (value) => ["true", "false"].includes(value),
      cast: (value) => value === "true",
    },
  ],
  [
    types.NodeEnv,
    {
      validate: (value) => Object.values(nodeEnv).includes(value),
      cast: (value) => value,
    },
  ],
])

const getOption = (name) => {
  return options.find((option) => option.name === name)
}

const getEnvKey = (name) => {
  return Object.entries(env).find(([key, value]) => value === name)[0]
}

const valueInEnv = (name) => {
  return name in repo
}

const getRawValue = (name) => {
  return repo[name]
}

const getValue = (name, type) => {
  const rawValue = getRawValue(name)
  return rawValue ? typesMap.get(type)?.cast(rawValue) : undefined
}

const validate = (name, value) => {
  const option = getOption(name)
  return (
    option &&
    (!option.required || value) &&
    (!value || typesMap.get(option.type)?.validate(value))
  )
}

const validateAll = () => {
  for (const option of options) {
    const value = getRawValue(option.name)
    if (option.required && !value) {
      throw new EnvironmentError(
        `Environment variable '${option.name}' is required but wasn't provided`,
      )
    }
    if (valueInEnv(option.name) && !validate(option.name, value)) {
      throw new EnvironmentError(
        `Environment variable '${option.name}' is invalid - type should be ${option.type}`,
      )
    }
  }
}

const load = (platform, libs = {}) => {
  if (platform === "api") {
    const options = libs.commandLineArgs([
      {
        name: "env",
        alias: "e",
        defaultValue: "production",
        type: String,
      },
    ])
    const result = libs.dotenv.config({
      path: `./env/${options.env}.env`,
    })
    if (result.error) {
      throw result.error
    }
    repo = { ...process.env }
  } else if (platform === "app") {
    repo = { ...libs.expoConstants.default.manifest.extra.env }
  } else {
    repo = { ...process.env }
  }
  validateAll()
}

const getAll = () => {
  return _.reduce(
    options,
    (accum, cur) => {
      if (valueInEnv(cur.name)) {
        return {
          ...accum,
          [getEnvKey(cur.name)]: getValue(cur.name, cur.type),
        }
      }
      return accum
    },
    {},
  )
}

const get = (name) => {
  const option = getOption(name)
  const value = option ? getValue(name, option.type) : undefined
  if (value === undefined) {
    throw new EnvironmentError(`Environment variable '${name}' does not exist`)
  }
  return value
}

const envUtils = {
  load,
  getAll,
  get,
}

export default envUtils
export { env, nodeEnv }
