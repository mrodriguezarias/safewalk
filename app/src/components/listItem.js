import React, { useRef } from "react"
import { View, StyleSheet } from "react-native"
import {
  useTheme,
  RadioButton,
  Paragraph,
  List,
  Divider,
} from "react-native-paper"
import Dialog from "./dialog"

const ListItem = ({
  label,
  onPress,
  onLongPress,
  options,
  value,
  onChange,
  right,
  ...restProps
}) => {
  const theme = useTheme()
  const optionsDialog = useRef()

  const handlePress = () => {
    if (onPress) {
      onPress()
      return
    }
    if (options) {
      optionsDialog.current.show()
    }
  }

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress({ optionsDialog })
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

  const renderRight = () => (
    <View style={styles.rightContainer}>
      {options && value ? (
        <Paragraph
          style={{ color: theme.colors.text, ...styles.selectedOption }}
        >
          {options.find((o) => o.value === value).label}
        </Paragraph>
      ) : (
        right && right()
      )}
    </View>
  )

  return (
    <>
      {options && renderDialog()}
      <List.Item
        title={label}
        onPress={handlePress}
        onLongPress={handleLongPress}
        right={renderRight}
        disabled={!onPress && !options}
        style={styles.container}
        {...restProps}
      />
      <Divider />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  dialogContent: {
    paddingHorizontal: 0,
  },
  optionItem: {
    paddingHorizontal: 25,
  },
  selectedOption: {
    fontWeight: "bold",
  },
  rightContainer: {
    marginLeft: 10,
    marginRight: 5,
    justifyContent: "center",
  },
})

export default ListItem