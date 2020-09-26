import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import Header from "../../components/header"
import MainScreen from "./main"
import EditUserScreen from "./editUser"
import AdminScreen from "./admin"
import PremiumScreen from "./premium"
import PaymentScreen from "./payment"
import SearchLocationScreen from "../map/searchLocation"

const Stack = createStackNavigator()

const SettingsScreen = () => {
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
        options={{ headerTitle: "Opciones" }}
      />
      <Stack.Screen
        name="EditUser"
        component={EditUserScreen}
        options={{ headerTitle: "Editar Usuario" }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ headerTitle: "Panel de Control" }}
      />
      <Stack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{ headerTitle: "Adquirir Premium" }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerTitle: "Información de Pago" }}
      />
      <Stack.Screen name="SearchLocation" component={SearchLocationScreen} />
    </Stack.Navigator>
  )
}

export default SettingsScreen
