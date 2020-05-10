import dotenv from "dotenv"
import commandLineArgs from "command-line-args"
import _ from "lodash"
import { enumToString, stringToEnum } from "./enum.util"

class EnvironmentError extends Error {}

enum Env {
  NodeEnv,
  ServerHost,
  ServerPort,
  MongoHost,
  MongoPort,
  MongoUser,
  MongoPassword,
  MongoDatabase,
  CookieDomain,
  CookiePath,
  SecureCookie,
  JwtSecret,
  CookieSecret,
  CookieExp,
}

enum NodeEnv {
  Local,
  Development,
  Production,
}

type Value<T> = T extends Env.NodeEnv
  ? NodeEnv
  : T extends Env.ServerHost
  ? string
  : T extends Env.ServerPort
  ? number
  : T extends Env.MongoHost
  ? string
  : T extends Env.MongoPort
  ? number
  : T extends Env.MongoUser
  ? string
  : T extends Env.MongoPassword
  ? string
  : T extends Env.MongoDatabase
  ? string
  : T extends Env.CookieDomain
  ? string
  : T extends Env.CookiePath
  ? string
  : T extends Env.SecureCookie
  ? boolean
  : T extends Env.JwtSecret
  ? string
  : T extends Env.CookieSecret
  ? string
  : T extends Env.CookieExp
  ? number
  : never

enum Type {
  String,
  Number,
  Boolean,
  NodeEnv,
}

interface Option {
  name: Env
  required: boolean
  type: Type
  default?: Value<Env>
}

const options: Option[] = [
  {
    name: Env.NodeEnv,
    required: true,
    type: Type.NodeEnv,
  },
  {
    name: Env.ServerHost,
    required: true,
    type: Type.String,
  },
  {
    name: Env.ServerPort,
    required: false,
    type: Type.Number,
    default: 4000,
  },
  {
    name: Env.MongoHost,
    required: true,
    type: Type.String,
  },
  {
    name: Env.MongoPort,
    required: false,
    type: Type.Number,
    default: 27017,
  },
  {
    name: Env.MongoUser,
    required: false,
    type: Type.String,
    default: "root",
  },
  {
    name: Env.MongoPassword,
    required: true,
    type: Type.String,
  },
  {
    name: Env.MongoDatabase,
    required: false,
    type: Type.String,
    default: "safewalk",
  },
  {
    name: Env.CookieDomain,
    required: true,
    type: Type.String,
  },
  {
    name: Env.CookiePath,
    required: true,
    type: Type.String,
  },
  {
    name: Env.SecureCookie,
    required: false,
    type: Type.Boolean,
    default: false,
  },
  {
    name: Env.JwtSecret,
    required: true,
    type: Type.String,
  },
  {
    name: Env.CookieSecret,
    required: true,
    type: Type.String,
  },
  {
    name: Env.CookieExp,
    required: true,
    type: Type.Number,
  },
]

const typesMap: Map<
  Type,
  {
    validate: (value: string) => boolean
    cast: (value: string) => Value<Env>
  }
> = new Map([
  [
    Type.String,
    {
      validate: (value) => _.isString(value),
      cast: (value) => value,
    },
  ],
  [
    Type.Number,
    {
      validate: (value) => _.isFinite(_.parseInt(value)),
      cast: (value) => _.parseInt(value),
    },
  ],
  [
    Type.Boolean,
    {
      validate: (value) => ["true", "false"].includes(value),
      cast: (value) => value === "true",
    },
  ],
  [
    Type.NodeEnv,
    {
      validate: (value) => stringToEnum(value, NodeEnv) !== undefined,
      cast: (value) => stringToEnum(value, NodeEnv),
    },
  ],
])

const valueInEnv = (name: Env | string): boolean => {
  const key = _.flow(
    (name) => (_.isString(name) ? name : enumToString(name, Env)),
    _.snakeCase,
    _.toUpper,
  )(name)
  return key in process.env
}

const getRawValue = (name: Env | string): string | undefined => {
  const key = _.flow(
    (name) => (_.isString(name) ? name : enumToString(name, Env)),
    _.snakeCase,
    _.toUpper,
  )(name)
  return process.env[key]
}

const getValue = (name: Env, type: Type): Value<Env> | undefined => {
  const rawValue = getRawValue(name)
  return rawValue ? typesMap.get(type)?.cast(rawValue) : undefined
}

const validate = (name: Env, value: string | undefined): boolean => {
  const option = options.find((option) => option.name === name)
  return (option &&
    (!option.required || value) &&
    (!value || typesMap.get(option.type)?.validate(value))) as boolean
}

const validateAll = () => {
  for (const option of options) {
    const nameAsString = enumToString(option.name, Env)
    const value = getRawValue(nameAsString)
    if (option.required && !value) {
      throw new EnvironmentError(
        `Environment variable '${nameAsString}' is required but wasn't provided`,
      )
    }
    if (valueInEnv(option.name) && !validate(option.name, value)) {
      throw new EnvironmentError(
        `Environment variable '${nameAsString}' is invalid - type should be ${option.type}`,
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

const getAll = (): NodeJS.ProcessEnv => {
  return _.reduce(
    options,
    (accum, cur) => {
      if (valueInEnv(cur.name)) {
        return {
          ...accum,
          [enumToString(cur.name, Env)]: getValue(cur.name, cur.type),
        }
      }
      return accum
    },
    {},
  )
}

const get = <T extends Env>(name: T): Value<T> => {
  const option = _.find(options, ["name", name])
  const value = option ? getValue(name, option.type) : undefined
  if (value === undefined) {
    throw new EnvironmentError(
      `Environment variable '${enumToString(name, Env)}' does not exist`,
    )
  }
  return value as Value<T>
}

const env = {
  load,
  getAll,
  get,
}

export default env
export { Env, NodeEnv }
