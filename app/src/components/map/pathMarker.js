import React, { memo } from "react"
import { Polyline } from "react-native-maps"
import { useTheme } from "react-native-paper"

const PathMarker = memo(({ coords }) => {
  const theme = useTheme()

  if (!coords || coords.length === 0) {
    return null
  }

  return (
    <Polyline
      coordinates={coords}
      strokeColor={theme.colors.accent}
      strokeWidth={3}
    />
  )
})

export default PathMarker
