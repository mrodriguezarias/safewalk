import yargs from "yargs"
import envUtils from "../shared/utils/env"
import createAdminUser from "./createAdminUser"
import generateExpoConfig from "./generateExpoConfig"
import uploadGeoData from "./uploadGeoData"
import uploadWeights from "./uploadWeights"
import uploadBoundary from "./uploadBoundary"

const scripts = [
  createAdminUser,
  generateExpoConfig,
  uploadGeoData,
  uploadWeights,
  uploadBoundary,
]

const handler = async (script, args) => {
  envUtils.load({
    platform: "script",
    env: args.env,
    libs: {
      dotenv: require("dotenv"),
    },
  })
  await script.run(args)
  console.info("Done")
}

let args = yargs
for (const script of scripts) {
  args = args.command({
    command: script.name,
    desc: "",
    handler: (args) => handler(script, args),
  })
}
args
  .demandCommand()
  .option("env", {
    alias: "e",
    type: "string",
    default: "local",
  })
  .version(false)
  .help(false)
  .strict().argv
