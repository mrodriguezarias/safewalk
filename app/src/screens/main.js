import React from "react"
import { useTheme } from "react-native-paper"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"

import MapScreen from "./map"
import UserScreen from "./user"
import SettingsScreen from "./settings"
import keyboardUtils from "../utils/keyboard"

const Tab = createMaterialBottomTabNavigator()

const MainScreen = () => {
  const theme = useTheme()

  keyboardUtils.init()

  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: theme.colors.tabBar }}
      shifting
      keyboardHidesNavigationBar={false}
    >
      <Tab.Screen
        name="Home"
        component={MapScreen}
        options={{
          title: "Mapa",
          tabBarIcon: "map",
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          title: "Usuario",
          tabBarIcon: "shield-account",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Opciones",
          tabBarIcon: "settings",
        }}
      />
    </Tab.Navigator>
  )
}

export default MainScreen
