import React from "react"
import { Button, View, Text } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import authActions from "../store/actions/auth"

const MainScreen = () => {
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.auth.user)

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 25, marginBottom: 10 }}>
        Bienvenido <Text style={{ fontWeight: "bold" }}>{loggedUser.name}</Text>
      </Text>
      <Button
        title="Cerrar Sesión"
        onPress={() => dispatch(authActions.logOut())}
      />
    </View>
  )
}

export default MainScreen
