import React from "react"
import { StyleSheet } from "react-native"
import { Title, useTheme } from "react-native-paper"
import { createStackNavigator } from "@react-navigation/stack"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import Header from "../../components/header"
import AuthScreen from "./auth"
import MainScreen from "./main"
import EditUserScreen from "./editUser"
import AdminScreen from "./admin"
import PremiumScreen from "./premium"
import PaymentScreen from "./payment"
import SearchLocationScreen from "../map/searchLocation"
import WalkListScreen from "../contacts/walkList"
import WalkDetailScreen from "../contacts/walkDetail"
import NotificationsScreen from "./notifications"

const Stack = createStackNavigator()

const UserScreen = () => {
  const user = useSelector((state) => state.auth.user)
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
              <Title>{user?.name ?? "Usuario"}</Title>
              {user?.premium && (
                <MaterialCommunityIcons
                  name="star-circle"
                  size={20}
                  color={theme.colors.safe}
                  style={styles.starIcon}
                />
              )}
            </>
          ),
        }}
      />
      <Stack.Screen
        name="EditUser"
        component={EditUserScreen}
        options={{ headerTitle: "Editar Datos" }}
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
      <Stack.Screen
        name="WalkList"
        component={WalkListScreen}
        options={{ headerTitle: "Mis Recorridos" }}
      />
      <Stack.Screen
        name="WalkDetail"
        component={WalkDetailScreen}
        options={{ headerTitle: "Recorrido" }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerTitle: "Iniciar Sesión o Registrarse" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerTitle: "Notificaciones" }}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  starIcon: {
    marginLeft: 2,
  },
})

export default UserScreen
