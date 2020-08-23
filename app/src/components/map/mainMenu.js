import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { Menu } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"

import AppbarAction from "../appbarAction"

const MainMenu = ({ navigation }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    setVisible((visible) => !visible)
  }

  const navigate = (screen) => {
    navigation.navigate(screen)
    setVisible(false)
  }

  return (
    <Menu
      visible={visible}
      onDismiss={toggleVisible}
      anchor={<AppbarAction icon="dots-vertical" onPress={toggleVisible} />}
    >
      <Menu.Item
        title="Buscar Lugares"
        icon={({ size, color }) => (
          <MaterialIcons name="search" size={size} color={color} />
        )}
        onPress={() => navigate("SearchLocation")}
        titleStyle={styles.itemTitle}
      />
    </Menu>
  )
}

const styles = StyleSheet.create({
  itemTitle: {
    marginLeft: -20,
  },
})

export default MainMenu
