import React from "react"
import { Appbar, useTheme } from "react-native-paper"

const Header = ({ scene, previous, navigation }) => {
  const theme = useTheme()
  const { options } = scene.descriptor
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
      {previous && <Appbar.BackAction onPress={() => navigation.pop()} />}
      <Appbar.Content title={title} />
      {options.headerRight && options.headerRight({ navigation })}
    </Appbar.Header>
  )
}

export default Header
