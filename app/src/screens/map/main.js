import React from "react"
import { StyleSheet, View } from "react-native"

import ActionBar from "../../components/map/actionBar"
import Map from "../../components/map/map"

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ActionBar navigation={navigation} />
      <Map />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default MainScreen
