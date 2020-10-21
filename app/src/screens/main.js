import React from "react"
import { useTheme } from "react-native-paper"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { useSelector } from "react-redux"

import MapScreen from "./map"
import ContactsScreen from "./contacts"
import UserScreen from "./user"
import keyboardUtils from "../utils/keyboard"

const Tab = createMaterialBottomTabNavigator()

const MainScreen = () => {
  const theme = useTheme()
  const logged = useSelector((state) => state.auth.logged)

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
      {logged && (
        <Tab.Screen
          name="Contacts"
          component={ContactsScreen}
          options={{
            title: "Contactos",
            tabBarIcon: "account-group",
          }}
        />
      )}
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          title: "Usuario",
          tabBarIcon: "shield-account",
        }}
      />
    </Tab.Navigator>
  )
}

export default MainScreen
