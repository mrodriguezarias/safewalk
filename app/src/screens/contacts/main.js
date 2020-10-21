import React, { useLayoutEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { useIsFocused } from "@react-navigation/native"
import ContactList from "../../components/contacts/contactList"
import AppbarAction from "../../components/appbarAction"
import useRequests from "../../hooks/user/useRequests"

const Tab = createMaterialTopTabNavigator()

const MainScreen = (props) => {
  const { navigation } = props
  const isFocused = useIsFocused()
  const logged = useSelector((state) => state.auth.logged)
  const requests = useRequests(isFocused)
  const pendingReqs = requests.length > 0

  const getBellButton = useCallback(
    () => (
      <AppbarAction
        icon={pendingReqs ? "bell" : "bell-outline"}
        onPress={() => navigation.navigate("Requests")}
      />
    ),
    [navigation, pendingReqs],
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: logged && getBellButton,
    })
  }, [navigation, logged, getBellButton])

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Cuidados"
        component={ContactList}
        initialParams={{ relation: "cared" }}
      />
      <Tab.Screen
        name="Cuidadores"
        component={ContactList}
        initialParams={{ relation: "carer" }}
      />
    </Tab.Navigator>
  )
}

export default MainScreen
