import qs from "qs"
import HttpStatus from "http-status-codes"
import fetch from "node-fetch"

import storageUtils from "./storage"
import urlUtils from "./url"
import HttpError from "../errors/http"
import envUtils, { env } from "./env"

const abortControllers = new Map()

const doRequest = async ({ method, uri, params, data }) => {
  const acKey = Date.now()
  const acVal = new AbortController()
  abortControllers.set(acKey, acVal)
  const outside = urlUtils.isAbsolute(uri)
  let url = outside ? uri : urlUtils.join(envUtils.get(env.Url), "api", uri)
  if (params !== undefined) {
    url += `?${qs.stringify(params)}`
  }
  const auth = outside ? null : await storageUtils.get("auth")
  const options = {
    method: (method ?? "get").toUpperCase(),
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
      ...(auth && { Authorization: auth }),
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    ...(data && { body: JSON.stringify(data) }),
    signal: acVal.signal,
  }
  const response = await fetch(url, options)
  let json = null
  if (response.headers.get("Content-Type") === "application/json") {
    json = await response.json()
  } else {
    const text = await response.text()
    if (text) {
      json = JSON.parse(text.replace(/^\(|\)$/g, ""))
    }
  }
  abortControllers.delete(acKey)
  if (json === undefined) {
    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Internal server error",
    )
  }
  if (!response.ok) {
    throw new HttpError(json.status, json.message)
  }
  return json
}

const doRequestWrapper = async (...args) => {
  return await doRequest(...args)
}

const requestUtils = {
  get: async (uri, params) => {
    return doRequestWrapper({ method: "get", uri, params })
  },
  post: async (uri, data) => {
    return doRequestWrapper({ method: "post", uri, data })
  },
  put: async (uri, data, params) => {
    return doRequestWrapper({ method: "put", uri, params, data })
  },
  delete: async (uri, params) => {
    return doRequestWrapper({ method: "delete", uri, params })
  },
  abort: () => {
    abortControllers.forEach((abortController) => abortController.abort())
  },
}

export default requestUtils
