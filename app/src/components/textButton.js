import React from "react"
import { StyleSheet } from "react-native"
import { Button, Text } from "native-base"

const textButton = ({ text, style, ...props }) => (
  <Button transparent style={{ ...styles.button, ...style }} {...props}>
    <Text>{text}</Text>
  </Button>
)

const styles = StyleSheet.create({
  button: { height: "auto" },
})

export default textButton
