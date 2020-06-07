import { fetchUtils } from "react-admin"
import simpleRestProvider from "ra-data-simple-rest"
import urlUtils from "../../../shared/utils/url"
import envUtils, { env } from "../../../shared/utils/env"
import storageUtils from "../../../shared/utils/storage"

const apiUrl = urlUtils.join(envUtils.get(env.Url), "api")
const fetchJson = (url, options = {}) => {
  options.user = {
    authenticated: true,
    token: storageUtils.load("auth"),
  }
  return fetchUtils.fetchJson(url, options)
}
const dataProvider = simpleRestProvider(apiUrl, fetchJson)

export default dataProvider
