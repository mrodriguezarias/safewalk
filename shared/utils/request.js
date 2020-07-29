import qs from "qs"
import HttpStatus from "http-status-codes"
import fetch from "node-fetch"

import storageUtils from "./storage"
import urlUtils from "./url"
import HttpError from "../errors/http"
import envUtils, { env } from "./env"

const doRequest = async ({ method, uri, params, data }) => {
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

const requestUtils = {
  get: async (uri, params) => {
    return doRequest({ method: "get", uri, params })
  },
  post: async (uri, data) => {
    return doRequest({ method: "post", uri, data })
  },
  put: async (uri, data, params) => {
    return doRequest({ method: "put", uri, params, data })
  },
  delete: async (uri, params) => {
    return doRequest({ method: "delete", uri, params })
  },
}

export default requestUtils
