import createAdminUser from "./createAdminUser"
import generateExpoConfig from "./generateExpoConfig"
import uploadGeoData from "./uploadGeoData"

const scripts = [createAdminUser, generateExpoConfig, uploadGeoData]

;(() => {
  const [command, ...args] = process.argv.slice(2)
  const script = scripts.find((script) => script.name === command)
  if (!script) {
    console.error("Script not found")
    return
  }

  script.run(args)
})()
