import React from "react"
import { View, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import Input from "../input"
import timeUtils from "../../../../shared/utils/time"

const WalkDetailInfoBar = ({ walk }) => {
  const theme = useTheme()
  const state = !walk.end
    ? "En camino"
    : walk.arrived
    ? "Llegada segura"
    : "Finalizado"
  const duration = timeUtils.getTimeDifference(walk.start, walk.updated)
  const updated = timeUtils.getRelativeTime(walk.updated)
  return (
    <View style={{ backgroundColor: theme.colors.back }}>
      <View style={styles.card}>
        <Input label="Trayecto" value={walk.safe ? "SafeWalk" : "RogueWalk"} />
        <Input label="Estado" value={state} />
      </View>
      <View style={styles.card}>
        <Input label="Duración" value={duration} />
        <Input label="Última actualización" value={updated} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
})

export default WalkDetailInfoBar
