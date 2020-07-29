import fs from "fs"
import boundaryService from "../api/src/services/boundary"
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
    console.log("Parsing file…")
    const data = fs.readFileSync(path)
    const { geometries } = JSON.parse(data)
    const location = geometries[0]
    console.log("Deleting previous boundary…")
    await boundaryService.deleteAllBoundaries()
    console.log("Adding boundary…")
    await boundaryService.createBoundary({ location })
  },
}

export default uploadBoundary
