import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { TextInput, TouchableRipple, Text } from "react-native-paper"
import TextScaler from "./textScaler"

const Input = ({ label, value = "", onPress, disabled = false }) => {
  const [fontSize, setFontSize] = useState()
  const [text, setText] = useState()
  const [inputWidth, setInputWidth] = useState()

  return (
    <View style={styles.inputContainer}>
      <TextScaler
        width={inputWidth}
        offset={18}
        hidden
        fontSize={16}
        minFontSize={10}
        setFontSize={setFontSize}
        setText={setText}
      >
        {value}
      </TextScaler>
      <TextInput
        label={label}
        editable={false}
        onLayout={({ nativeEvent: { layout } }) => {
          setInputWidth(layout.width)
        }}
        value={text}
        theme={{ roundness: 0 }}
        multiline={false}
        numberOfLines={1}
        style={[styles.input, { fontSize }]}
        underlineColor="transparent"
      />
      <TouchableRipple
        onPress={disabled ? undefined : onPress}
        style={styles.touchable}
      >
        <Text />
      </TouchableRipple>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  input: {
    height: 60,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    marginLeft: 15,
  },
  touchable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
})

export default Input
