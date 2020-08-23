import React from "react"
import { StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { Title, useTheme } from "react-native-paper"
import { Entypo } from "@expo/vector-icons"

import MainScreen from "./main"
import Header from "../../components/header"
import ChangeLocationScreen from "./changeLocation"
import SearchPlacesScreen from "./searchPlaces"

const Stack = createStackNavigator()

const MapScreen = () => {
  const theme = useTheme()
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
        options={{
          headerTitle: () => (
            <>
              <>
                <Entypo name="shield" size={20} color={theme.colors.text} />{" "}
              </>
              <Title style={styles.title}>SafeWalk</Title>
            </>
          ),
        }}
      />
      <Stack.Screen
        name="ChangeLocation"
        component={ChangeLocationScreen}
        options={({ route }) => ({
          headerTitle: `Cambiar ${route.params.label}`,
        })}
      />
      <Stack.Screen
        name="SearchPlaces"
        component={SearchPlacesScreen}
        options={{
          headerTitle: "Buscar Lugares",
        }}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  title: {
    margin: 50,
  },
})

export default MapScreen
