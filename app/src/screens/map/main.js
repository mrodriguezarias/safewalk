import React from "react"
import { StyleSheet, View } from "react-native"

import Bar from "../../components/map/bar"
import Map from "../../components/map/map"

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Bar navigation={navigation} />
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
