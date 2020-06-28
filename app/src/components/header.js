import React from "react"
import { Appbar, useTheme } from "react-native-paper"
import _ from "lodash"

const Header = ({ scene, previous, navigation }) => {
  const theme = useTheme()
  const { options } = scene.descriptor

  const title = (() => {
    if (options.headerTitle !== undefined) {
      return _.isFunction(options.headerTitle)
        ? options.headerTitle()
        : options.headerTitle
    }
    return options.title !== undefined ? options.title : scene.route.name
  })()

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.header }}>
      {previous && <Appbar.BackAction onPress={() => navigation.pop()} />}
      <Appbar.Content title={title} />
      {options.headerRight && options.headerRight({ navigation })}
    </Appbar.Header>
  )
}

export default Header
