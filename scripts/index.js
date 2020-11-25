import yargs from "yargs"
import envUtils from "../shared/utils/env"
import createAdminUser from "./createAdminUser"
import generateExpoConfig from "./generateExpoConfig"
import uploadGeoData from "./uploadGeoData"
import uploadWeights from "./uploadWeights"
import uploadBoundary from "./uploadBoundary"
import uploadCategories from "./uploadCategories"
import uploadPlaces from "./uploadPlaces"
import addAddresses from "./addAddresses"
import addUsers from "./addUsers"
import addProfessors from "./addProfessors"

const scripts = [
  createAdminUser,
  generateExpoConfig,
  uploadGeoData,
  uploadWeights,
  uploadBoundary,
  uploadCategories,
  uploadPlaces,
  addAddresses,
  addUsers,
  addProfessors,
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
    builder: script?.options,
    handler: (args) => handler(script, args),
  })
}
args
  .demandCommand()
  .option("env", {
    alias: "e",
    desc: "Specify environment",
    type: "string",
    default: "local",
  })
  .version(false)
  .help()
  .strict().argv
