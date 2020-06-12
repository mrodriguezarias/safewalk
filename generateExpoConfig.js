import path from "path"
import dotenv from "dotenv"
import fs from "fs"

const env = dotenv.config({
  path: path.resolve(
    process.cwd(),
    `env/${process.env.NODE_ENV ?? "prod"}.env`,
  ),
}).parsed

const config = {
  expo: {
    name: "safewalk",
    slug: "safewalk",
    platforms: ["ios", "android"],
    version: "1.0.0",
    orientation: "portrait",
    icon: "./app/assets/icon.png",
    splash: {
      image: "./app/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
    },
    extra: {
      env,
    },
  },
}

const data = JSON.stringify(config)
fs.writeFileSync("./app.json", data)
