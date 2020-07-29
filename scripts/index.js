import yargs from "yargs"
import envUtils from "../shared/utils/env"
import createAdminUser from "./createAdminUser"
import generateExpoConfig from "./generateExpoConfig"
import uploadGeoData from "./uploadGeoData"
import uploadWeights from "./uploadWeights"

const scripts = [
  createAdminUser,
  generateExpoConfig,
  uploadGeoData,
  uploadWeights,
]

const handler = async (script, args) => {
  const env = args.env ?? "local"
  envUtils.load({
    platform: "script",
    env,
    libs: {
      dotenv: require("dotenv"),
    },
  })
  await script.run(args)
  console.log("Done")
}

let args = yargs
for (const script of scripts) {
  args = args.command({
    command: script.name,
    desc: "",
    handler: (args) => handler(script, args),
  })
}
args.demandCommand().version(false).help(false).argv
