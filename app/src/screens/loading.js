import React, { useEffect } from "react"
import { ActivityIndicator, View, StyleSheet } from "react-native"
import { useDispatch } from "react-redux"
import appActions from "../store/actions/app"

const LoadingScreen = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(appActions.load())
  }, [])

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default LoadingScreen
