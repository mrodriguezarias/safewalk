import fs from "fs"
import geoService from "../api/src/services/geo"
import dbUtils from "../shared/utils/db"

const uploadBoundary = {
  name: "upload_boundary",
  run: async (args) => {
    const path = uploadBoundary.parseArgs(args)
    await dbUtils.connect(true)
    try {
      await uploadBoundary.parseFile(path)
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
  parseArgs: (args) => {
    const path = args._?.[1] ?? "./data/boundary.json"
    if (!fs.existsSync(path)) {
      throw Error(`file '${path}' does not exist`)
    }
    return path
  },
  parseFile: async (path) => {
    console.info("Parsing file…")
    const data = fs.readFileSync(path)
    const { geometries } = JSON.parse(data)
    const location = geometries[0]
    console.info("Deleting previous boundary…")
    await geoService.deleteAllBoundaries()
    console.info("Adding boundary…")
    await geoService.createBoundary({ location })
  },
}

export default uploadBoundary
