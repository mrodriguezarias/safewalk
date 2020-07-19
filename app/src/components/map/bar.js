import React from "react"
import { StyleSheet, View } from "react-native"
import {
  TextInput,
  TouchableRipple,
  Text,
  IconButton,
  useTheme,
} from "react-native-paper"
import { useSelector, useDispatch } from "react-redux"
import walkActions from "../../store/actions/walk"

const Bar = ({ navigation }) => {
  const source = useSelector((state) => state.walk.source?.name)
  const target = useSelector((state) => state.walk.target?.name)
  const theme = useTheme()
  const dispatch = useDispatch()

  const changeLocation = (key, label) => {
    navigation.navigate("ChangeLocation", { key, label })
  }

  const swapLocations = () => {
    dispatch(walkActions.swapLocations())
  }

  const Input = ({ label, name, value = "" }) => (
    <View style={styles.inputContainer}>
      <TextInput
        label={label}
        editable={false}
        value={value.length > 18 ? value.slice(0, 18) + "…" : value}
        theme={{ roundness: 0 }}
        multiline={false}
        numberOfLines={1}
        style={[
          styles.input,
          {
            fontSize: value.length > 16 ? 14 : 16,
          },
        ]}
        underlineColor="transparent"
      />
      <TouchableRipple
        onPress={() => changeLocation(name, label)}
        style={styles.touchable}
      >
        <Text />
      </TouchableRipple>
    </View>
  )

  const SwapButton = () => (
    <View style={styles.swapContainer}>
      <IconButton icon="swap-horizontal" size={20} onPress={swapLocations} />
    </View>
  )

  const backgroundColor = theme.dark ? "#343434" : "#E5E4E2"

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Input label="Origen" name="source" value={source} />
      <SwapButton />
      <Input label="Destino" name="target" value={target} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "auto",
    backgroundColor: "pink",
  },
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  input: {
    height: 60,
    backgroundColor: "transparent",
  },
  touchable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  swapContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Bar
