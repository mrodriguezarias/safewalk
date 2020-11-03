import { createRef } from "react"

const navigationUtils = {
  getRef: () => {
    if (navigationUtils._ref === null) {
      navigationUtils._ref = createRef()
    }
    return navigationUtils._ref
  },
  navigate: (name, params) => {
    navigationUtils._ref?.current?.navigate(name, params)
  },
}

navigationUtils._ref = null

export default navigationUtils
