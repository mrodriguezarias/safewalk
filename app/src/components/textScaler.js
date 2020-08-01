import React, { useState, useEffect } from "react"
import { Text, StyleSheet } from "react-native"

const TextScaler = ({
  width,
  offset = 0,
  minFontSize,
  fontSize: initialFontSize = 14,
  setFontSize: returnFontSize = () => {},
  setText: returnText = () => {},
  hidden: alwaysHidden,
  children,
  style,
  ...textProps
}) => {
  const [fontSize, setFontSize] = useState(initialFontSize)
  const [hidden, setHidden] = useState(true)
  const [text, setText] = useState("")

  useEffect(() => {
    findBestSize(children, width)
  }, [children, width, minFontSize, offset])

  const findBestSize = (text, width) => {
    setFontSize(initialFontSize)
    setText(text)
    setHidden(!!width)
  }

  const handleLayout = async ({ nativeEvent: { layout } }) => {
    if (!text || !hidden || !width || layout.width < 1) {
      return
    }
    if (layout.width > width - offset) {
      if (fontSize === minFontSize) {
        setText(text.replace(/…$/, "").slice(0, -1) + "…")
      } else {
        setFontSize(fontSize - 1)
      }
    } else {
      setHidden(false)
      returnFontSize(fontSize)
      returnText(text)
    }
  }

  return (
    <Text
      key={`${children}${width}${minFontSize}${offset}${text}`}
      numberOfLines={1}
      onLayout={handleLayout}
      style={[(alwaysHidden || hidden) && styles.hidden, { fontSize }, style]}
      {...textProps}
    >
      {text}
    </Text>
  )
}

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
    position: "absolute",
  },
})

export default TextScaler
