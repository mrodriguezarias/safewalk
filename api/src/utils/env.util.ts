import dotenv from "dotenv"
import commandLineArgs from "command-line-args"
import _ from "lodash"

class EnvironmentError extends Error {}

type Value = string | number | boolean
enum Type {
  String,
  Number,
  Boolean,
}

interface Option {
  name: string
  required: boolean
  type: Type
  default?: Value
}

const options: Option[] = [
  {
    name: "NODE_ENV",
    required: true,
    type: Type.String,
  },
  {
    name: "SERVER_HOST",
    required: true,
    type: Type.String,
  },
  {
    name: "SERVER_PORT",
    required: false,
    type: Type.Number,
    default: 4000,
  },
  {
    name: "MONGO_HOST",
    required: true,
    type: Type.String,
  },
  {
    name: "MONGO_PORT",
    required: false,
    type: Type.Number,
    default: 27017,
  },
  {
    name: "MONGO_USER",
    required: false,
    type: Type.String,
    default: "root",
  },
  {
    name: "MONGO_PASSWORD",
    required: true,
    type: Type.String,
  },
  {
    name: "MONGO_DATABASE",
    required: false,
    type: Type.String,
    default: "safewalk",
  },
  {
    name: "COOKIE_DOMAIN",
    required: true,
    type: Type.String,
  },
  {
    name: "COOKIE_PATH",
    required: true,
    type: Type.String,
  },
  {
    name: "SECURE_COOKIE",
    required: false,
    type: Type.Boolean,
    default: false,
  },
  {
    name: "JWT_SECRET",
    required: true,
    type: Type.String,
  },
  {
    name: "COOKIE_SECRET",
    required: true,
    type: Type.String,
  },
  {
    name: "COOKIE_EXP",
    required: true,
    type: Type.Number,
  },
]

const typesMap: Map<
  Type,
  {
    validate: (value: string) => boolean
    cast: (value: string) => Value
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
])

const validate = (name: string, value: string): boolean => {
  const option = options.find((option) => option.name === name)
  return !!(
    option &&
    (!option.required || value) &&
    typesMap.get(option.type).validate(value)
  )
}

const validateAll = () => {
  for (const option of options) {
    if (option.required && !process.env[option.name]) {
      throw new EnvironmentError(
        `Environment variable '${option.name}' is required but wasn't provided`,
      )
    }
    if (
      option.name in process.env &&
      !validate(option.name, process.env[option.name])
    ) {
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

const getValue = (name: string, type: Type): Value => {
  return typesMap.get(type).cast(process.env[name])
}

const getAll = (): NodeJS.ProcessEnv => {
  return _.reduce(
    options,
    (accum, cur) => {
      if (cur.name in process.env) {
        return {
          ...accum,
          [cur.name]: getValue(cur.name, cur.type),
        }
      }
      return accum
    },
    {},
  )
}

const get = (name: string): Value => {
  const option = _.find(options, ["name", name])
  if (!option) {
    throw new EnvironmentError(`Environment variable '${name}' does not exist`)
  }
  return getValue(name, option.type)
}

const getString = (name: string): string => get(name) as string
const getNumber = (name: string): number => get(name) as number
const getBoolean = (name: string): boolean => get(name) as boolean

const env = {
  load,
  getAll,
  get,
  getString,
  getNumber,
  getBoolean,
}

export default env
