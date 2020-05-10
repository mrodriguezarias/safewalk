import _ from "lodash"

type StandardEnum<T> = {
  [id: string]: T | string
  [nu: number]: string
}

const stringToEnum = <T>(name: string, type: StandardEnum<T>): T => {
  const key = _.chain(name).camelCase().upperFirst().value()
  return type[key as keyof StandardEnum<T>] as T
}

const enumToString = <T>(name: T, type: StandardEnum<T>): string => {
  return type[(name as unknown) as keyof StandardEnum<number>] as string
}

export { stringToEnum, enumToString }
