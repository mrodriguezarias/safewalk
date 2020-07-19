import React from "react"
import { StyleSheet, View } from "react-native"
import { TextInput, TouchableRipple, Text } from "react-native-paper"
import { useSelector } from "react-redux"

const Bar = ({ navigation }) => {
  const source = useSelector((state) => state.walk.source?.name)
  const target = useSelector((state) => state.walk.target?.name)

  const changeLocation = (key, label) => {
    navigation.navigate("ChangeLocation", { key, label })
  }

  const renderInput = ({ label, key, value = "" }) => (
    <View key={key} style={styles.inputContainer}>
      <TextInput
        label={label}
        editable={false}
        value={value.length > 20 ? value.slice(0, 20) + "…" : value}
        theme={{ roundness: 0 }}
        multiline={false}
        numberOfLines={1}
        style={[styles.input, { fontSize: value.length > 16 ? 14 : 16 }]}
      />
      <TouchableRipple
        onPress={() => changeLocation(key, label)}
        style={styles.touchable}
      >
        <Text />
      </TouchableRipple>
    </View>
  )

  const inputs = [
    { label: "Origen", key: "source", value: source },
    { label: "Destino", key: "target", value: target },
  ]

  return <View style={styles.container}>{inputs.map(renderInput)}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "auto",
  },
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  input: {
    height: 60,
  },
  touchable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
})

export default Bar
