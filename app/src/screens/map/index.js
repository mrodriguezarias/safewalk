import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import MainScreen from "./main"
import Header from "./header"

const Stack = createStackNavigator()

const MapScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      headerMode="screen"
      screenOptions={{
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerTitle: "Mapa" }}
      />
    </Stack.Navigator>
  )
}

export default MapScreen
