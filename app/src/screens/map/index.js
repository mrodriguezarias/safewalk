import React from "react"
import { StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { Title, useTheme } from "react-native-paper"
import { Entypo } from "@expo/vector-icons"

import MainScreen from "./main"
import Header from "../../components/header"
import SearchLocationScreen from "./searchLocation"
import RelatedPlacesScreen from "./relatedPlaces"
import ReportZoneScreen from "./reportZone"
import ChangeAppearanceScreen from "./changeAppearance"

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
      <Stack.Screen name="SearchLocation" component={SearchLocationScreen} />
      <Stack.Screen
        name="RelatedPlaces"
        component={RelatedPlacesScreen}
        options={{
          headerTitle: "Lugares Relacionados",
        }}
      />
      <Stack.Screen
        name="ReportZone"
        component={ReportZoneScreen}
        options={{
          headerTitle: "Reportar Zona Peligrosa",
        }}
      />
      <Stack.Screen
        name="ChangeAppearance"
        component={ChangeAppearanceScreen}
        options={{
          headerTitle: "Configurar Apariencia",
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
