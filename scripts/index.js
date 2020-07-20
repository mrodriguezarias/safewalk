import createAdminUser from "./createAdminUser"
import generateExpoConfig from "./generateExpoConfig"

const scripts = [createAdminUser, generateExpoConfig]

;(() => {
  const [command, ...args] = process.argv.slice(2)
  const script = scripts.find((script) => script.name === command)
  if (!script) {
    console.error("Script not found")
    return
  }

  script.run(args)
})()
