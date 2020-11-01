import path from "path"
import dotenv from "dotenv"
import fs from "fs"

const generateExpoConfig = {
  name: "generate_expo_config",
  run: () => {
    const APP_ID = "utn.frba.proyecto.safewalk"
    const APP_VERSION = "1.0.0"
    const ASSETS_PATH = "./app/assets"
    const BACKGROUND_COLOR = "#252627"
    const CONFIG_PATH = "./app.json"

    const nodeEnv = process.env.NODE_ENV ?? "prod"
    const envPath = path.resolve(process.cwd(), `env/${nodeEnv}.env`)

    const app = fs.existsSync(CONFIG_PATH)
      ? JSON.parse(fs.readFileSync(CONFIG_PATH))
      : null
    const curEnv = app?.expo?.extra?.env?.NODE_ENV

    const getFileUpdatedDate = (path) => {
      const stats = fs.statSync(path)
      return stats.mtimeMs
    }

    if (
      !(
        curEnv !== nodeEnv ||
        getFileUpdatedDate(CONFIG_PATH) < getFileUpdatedDate(__filename) ||
        getFileUpdatedDate(CONFIG_PATH) < getFileUpdatedDate(envPath)
      )
    ) {
      process.exit(0)
    }

    const env = dotenv.config({ path: envPath }).parsed

    const config = {
      expo: {
        name: "SafeWalk",
        slug: "safewalk",
        privacy: "unlisted",
        platforms: ["ios", "android"],
        version: "1.0.0",
        orientation: "portrait",
        icon: path.resolve(ASSETS_PATH, "icon.png"),
        backgroundColor: BACKGROUND_COLOR,
        splash: {
          image: path.resolve(ASSETS_PATH, "splash.png"),
          resizeMode: "contain",
          backgroundColor: BACKGROUND_COLOR,
        },
        updates: {
          fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        userInterfaceStyle: "automatic",
        android: {
          package: APP_ID,
          versionCode: +APP_VERSION.replace(/\./g, ""),
          softwareKeyboardLayoutMode: "pan",
          useNextNotificationsApi: true,
          googleServicesFile: "./google-services.json",
          config: {
            googleMaps: {
              apiKey: "AIzaSyBGK8S5A8RxqEDqb_nAJXGQKrqQ4nEDS0c",
            },
          },
        },
        ios: {
          bundleIdentifier: APP_ID,
          buildNumber: APP_VERSION,
          supportsTablet: false,
          config: {
            googleMapsApiKey: "AIzaSyBAyfYLI-abN-zEv8BPSAau3wRMrC6uykw",
          },
        },
        extra: {
          env,
        },
      },
    }

    const data = JSON.stringify(config)
    fs.writeFileSync(CONFIG_PATH, data)
  },
}

export default generateExpoConfig
