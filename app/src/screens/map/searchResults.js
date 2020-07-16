import React from "react"
import { ScrollView, StyleSheet } from "react-native"
import { useTheme, List } from "react-native-paper"

const searchResults = () => {
  const theme = useTheme()

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
    >
      <List.Item
        title="Place #1"
        description="Item description"
        right={(props) => <List.Icon {...props} icon="arrow-top-left" />}
        onPress={() => {}}
        style={styles.item}
      />
      <List.Item
        title="Place #2"
        description="Item description"
        right={(props) => <List.Icon {...props} icon="arrow-top-left" />}
        onPress={() => {}}
        style={styles.item}
      />
      <List.Item
        title="Place #3"
        description="Item description"
        right={(props) => <List.Icon {...props} icon="arrow-top-left" />}
        onPress={() => {}}
        style={styles.item}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    zIndex: 10,
    // height: heights.window - heights.header - heights.keyboard,
    height: 300,
    width: "100%",
    opacity: 0.85,
    // paddingVertical: 10,
  },
  item: {
    padding: 0,
    // marginVertical: -3,
    paddingHorizontal: 10,
  },
})

export default searchResults
