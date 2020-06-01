import React from "react"
import { StyleProvider, Root } from "native-base"

import App from "./App"
import getTheme from "./theme/components"
import commonColor from "./theme/variables/commonColor"

const Setup = () => (
  <StyleProvider style={getTheme(commonColor)}>
    <Root>
      <App />
    </Root>
  </StyleProvider>
)

export default Setup
