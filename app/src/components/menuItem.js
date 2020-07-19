import React from "react"
import { View, StyleSheet } from "react-native"
import {
  Subheading,
  Divider,
  TouchableRipple,
  useTheme,
} from "react-native-paper"

const MenuItem = ({ label, children, onPress, accent = false }) => {
  const theme = useTheme()
  return (
    <TouchableRipple onPress={onPress}>
      <>
        <View style={styles.container}>
          <Subheading
            style={{ ...(accent && { color: theme.colors.accent }) }}
            numberOfLines={1}
          >
            {label}
          </Subheading>
          {children}
        </View>
        <Divider />
      </>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})

export default MenuItem
