import React from "react"
import { View } from "react-native"
import { Appbar, Title, useTheme } from "react-native-paper"
import _ from "lodash"
import { useDispatch } from "react-redux"
import appActions from "../store/actions/app"

const Header = ({
  scene,
  previous,
  navigation,
  children,
  style,
  ...headerProps
}) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { options } = scene.descriptor

  const title = (() => {
    if (_.isFunction(options.headerTitle)) {
      return options.headerTitle()
    }
    const title = options.headerTitle || options.title || scene.route.name
    return <Title>{title}</Title>
  })()

  const handleLayout = () => {
    if (Header.header) {
      Header.header.measureInWindow((...layout) => {
        dispatch(appActions.setHeight("header", layout[3]))
      })
    }
  }

  const renderBaseHeader = () => (
    <>
      {previous ? (
        <Appbar.BackAction onPress={() => navigation.pop()} />
      ) : (
        options.headerLeft && options.headerLeft({ navigation })
      )}
      <Appbar.Content title={title} style={{ alignItems: "center" }} />
      {options.headerRight ? (
        options.headerRight({ navigation })
      ) : (
        <Appbar.Action />
      )}
    </>
  )

  return (
    <View
      onLayout={handleLayout}
      ref={(el) => {
        Header.header = el
      }}
    >
      <Appbar.Header
        style={{ backgroundColor: theme.colors.header, ...style }}
        {...headerProps}
      >
        {children ?? renderBaseHeader()}
      </Appbar.Header>
    </View>
  )
}

export default Header
