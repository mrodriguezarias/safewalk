import React from "react"
import { View, StyleSheet } from "react-native"
import { Subheading, Divider, TouchableRipple } from "react-native-paper"

const SettingsItem = ({ label, children, onPress }) => (
  <TouchableRipple onPress={onPress}>
    <>
      <View style={styles.container}>
        <Subheading>{label}</Subheading>
        {children}
      </View>
      <Divider />
    </>
  </TouchableRipple>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})

export default SettingsItem
