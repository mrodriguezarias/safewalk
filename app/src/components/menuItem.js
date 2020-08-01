import React, { useRef } from "react"
import { View, StyleSheet } from "react-native"
import {
  Subheading,
  Divider,
  TouchableRipple,
  useTheme,
  RadioButton,
  Paragraph,
} from "react-native-paper"
import Dialog from "./dialog"

const MenuItem = ({ label, children, onPress, options, value, onChange }) => {
  const theme = useTheme()
  const optionsDialog = useRef()

  const handlePress = () => {
    if (onPress) {
      onPress()
    }
    if (options) {
      optionsDialog.current.show()
    }
  }

  const handleValueChange = (value) => {
    if (onChange) {
      onChange(value)
    }
    optionsDialog.current.hide()
  }

  const renderDialog = () => (
    <Dialog
      ref={optionsDialog}
      title={label}
      contentStyle={styles.dialogContent}
    >
      <RadioButton.Group onValueChange={handleValueChange} value={value}>
        {options.map(({ label, value }) => (
          <RadioButton.Item
            key={value}
            label={label}
            value={value}
            style={styles.optionItem}
          />
        ))}
      </RadioButton.Group>
    </Dialog>
  )

  const renderChildren = () => {
    if (children) {
      return children
    }
    if (options && value) {
      return (
        <Paragraph style={{ color: theme.colors.text, fontWeight: "bold" }}>
          {options.find((o) => o.value === value).label}
        </Paragraph>
      )
    }
    return null
  }

  return (
    <>
      {options && renderDialog()}
      <TouchableRipple onPress={handlePress}>
        <>
          <View style={styles.container}>
            <Subheading numberOfLines={1}>{label}</Subheading>
            {renderChildren()}
          </View>
          <Divider />
        </>
      </TouchableRipple>
    </>
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
  dialogContent: {
    paddingHorizontal: 0,
  },
  optionItem: {
    paddingHorizontal: 25,
  },
})

export default MenuItem
