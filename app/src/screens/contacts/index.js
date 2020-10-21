import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useSelector } from "react-redux"
import Header from "../../components/header"
import MainScreen from "./main"
import AppbarAction from "../../components/appbarAction"
import NewContactScreen from "./newContact"
import RequestsScreen from "./requests"
import PremiumScreen from "../user/premium"
import PaymentScreen from "../user/payment"
import WalkListScreen from "./walkList"
import WalkDetailScreen from "./walkDetail"

const Stack = createStackNavigator()

const ContactsScreen = () => {
  const user = useSelector((state) => state.auth.user)
  return (
    <Stack.Navigator
      initialRouteName="MainUser"
      headerMode="screen"
      screenOptions={{
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen
        name="MainUser"
        component={MainScreen}
        options={{
          headerLeft: ({ navigation }) =>
            user && (
              <AppbarAction
                icon="account-plus"
                onPress={() => navigation.navigate("NewContact")}
              />
            ),
          headerTitle: "Contactos",
        }}
      />
      <Stack.Screen
        name="NewContact"
        component={NewContactScreen}
        options={{ headerTitle: "Nuevo Contacto" }}
      />
      <Stack.Screen
        name="Requests"
        component={RequestsScreen}
        options={{ headerTitle: "Solicitudes" }}
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
      <Stack.Screen
        name="WalkList"
        component={WalkListScreen}
        options={{ headerTitle: "Recorridos" }}
      />
      <Stack.Screen
        name="WalkDetail"
        component={WalkDetailScreen}
        options={{ headerTitle: "Recorrido" }}
      />
    </Stack.Navigator>
  )
}

export default ContactsScreen
