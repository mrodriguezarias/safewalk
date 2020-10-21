import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { Menu } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"
import { useSelector } from "react-redux"

import AppbarAction from "../appbarAction"

const items = [
  {
    title: "Buscar Lugar o Dirección",
    icon: "search",
    screen: "SearchLocation",
  },
  {
    title: "Cambiar Ubicación",
    icon: "edit-location",
    screen: "SearchLocation",
    params: {
      key: "current",
    },
    admin: true,
  },
  {
    title: "Reportar Zona Peligrosa",
    icon: "report",
    screen: "ReportZone",
  },
  {
    title: "Configurar Apariencia",
    icon: "brush",
    screen: "ChangeAppearance",
  },
]

const MainMenu = ({ navigation }) => {
  const [visible, setVisible] = useState(false)
  const isAdmin = useSelector((state) => state.auth?.user?.admin)

  const toggleVisible = () => {
    setVisible((visible) => !visible)
  }

  const navigate = (...args) => {
    navigation.navigate(...args)
    setVisible(false)
  }

  return (
    <Menu
      visible={visible}
      onDismiss={toggleVisible}
      anchor={<AppbarAction icon="dots-vertical" onPress={toggleVisible} />}
    >
      {items.map(({ title, icon, screen, params, admin }, index) => {
        if (admin && !isAdmin) {
          return null
        }
        return (
          <Menu.Item
            key={index}
            title={title}
            icon={({ size, color }) => (
              <MaterialIcons name={icon} size={size} color={color} />
            )}
            onPress={() => navigate(screen, params)}
            titleStyle={styles.itemTitle}
          />
        )
      })}
    </Menu>
  )
}

const styles = StyleSheet.create({
  itemTitle: {
    marginLeft: -20,
  },
})

export default MainMenu
