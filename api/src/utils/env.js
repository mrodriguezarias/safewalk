import dotenv from "dotenv"
import commandLineArgs from "command-line-args"
import _ from "lodash"

import EnvironmentError from "../errors/EnvironmentError"

const env = {
  NodeEnv: "NODE_ENV",
  ServerHost: "SERVER_HOST",
  ServerPort: "SERVER_PORT",
  MongoHost: "MONGO_HOST",
  MongoPort: "MONGO_PORT",
  MongoUser: "MONGO_USER",
  MongoPassword: "MONGO_PASSWORD",
  MongoDatabase: "MONGO_DATABASE",
  MongoCluster: "MONGO_CLUSTER",
  CookieDomain: "COOKIE_DOMAIN",
  CookiePath: "COOKIE_PATH",
  SecureCookie: "SECURE_COOKIE",
  JwtSecret: "JWT_SECRET",
  CookieSecret: "COOKIE_SECRET",
  CookieExp: "COOKIE_EXP",
}

const nodeEnv = {
  Local: "local",
  Development: "development",
  Production: "production",
}

const types = {
  NodeEnv: "NodeEnv",
  String: "String",
  Number: "Number",
  Boolean: "Boolean",
}

const options = [
  {
    name: env.NodeEnv,
    required: true,
    type: types.NodeEnv,
  },
  {
    name: env.ServerHost,
    required: true,
    type: types.String,
  },
  {
    name: env.ServerPort,
    required: false,
    type: types.Number,
    default: 4000,
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
    name: env.CookieDomain,
    required: true,
    type: types.String,
  },
  {
    name: env.CookiePath,
    required: true,
    type: types.String,
  },
  {
    name: env.SecureCookie,
    required: false,
    type: types.Boolean,
    default: false,
  },
  {
    name: env.JwtSecret,
    required: true,
    type: types.String,
  },
  {
    name: env.CookieSecret,
    required: true,
    type: types.String,
  },
  {
    name: env.CookieExp,
    required: true,
    type: types.Number,
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
  return name in process.env
}

const getRawValue = (name) => {
  return process.env[name]
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

const load = () => {
  const options = commandLineArgs([
    {
      name: "env",
      alias: "e",
      defaultValue: "production",
      type: String,
    },
  ])

  const result = dotenv.config({
    path: `./env/${options.env}.env`,
  })

  if (result.error) {
    throw result.error
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
