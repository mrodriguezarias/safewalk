import React from "react"
import { useTheme } from "react-native-paper"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"

import MapScreen from "./map"
import UserScreen from "./user"

const Tab = createMaterialBottomTabNavigator()

const MainScreen = () => {
  const theme = useTheme()
  return (
    <Tab.Navigator barStyle={{ backgroundColor: theme.colors.tabBar }} shifting>
      <Tab.Screen
        name="Home"
        component={MapScreen}
        options={{
          title: "Mapa",
          tabBarIcon: "map-outline",
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          title: "Usuario",
          tabBarIcon: "shield-account-outline",
        }}
      />
    </Tab.Navigator>
  )
}

export default MainScreen
