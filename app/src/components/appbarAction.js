import React from "react"
import { Appbar, useTheme } from "react-native-paper"

const AppbarAction = (props) => {
  const theme = useTheme()
  return <Appbar.Action color={theme.colors.text} {...props} />
}

export default AppbarAction
