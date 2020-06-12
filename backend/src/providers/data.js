import { fetchUtils } from "react-admin"
import simpleRestProvider from "ra-data-simple-rest"
import urlUtils from "../../../shared/utils/url"
import envUtils, { env } from "../../../shared/utils/env"
import storageUtils from "../../../shared/utils/storage"

const apiUrl = urlUtils.join(envUtils.get(env.Url), "api")
const fetchJson = async (url, options = {}) => {
  const token = await storageUtils.get("auth")
  options.user = {
    authenticated: token !== null,
    token,
  }
  return await fetchUtils.fetchJson(url, options)
}
const dataProvider = simpleRestProvider(apiUrl, fetchJson)

export default dataProvider
