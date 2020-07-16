import React from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import BaseHeader from "../../components/header"
import { Searchbar } from "react-native-paper"
import { useSelector } from "react-redux"

const Header = (props) => {
  const source = useSelector((state) => state.walk.source)
  const target = useSelector((state) => state.walk.target)
  const heights = useSelector((state) => state.app.heights)

  const handleSearch = (event) => {
    const query = event.nativeEvent.text
    console.log("query", query)
    console.log("heights", heights)
  }

  return (
    <BaseHeader {...props} style={styles.header}>
      <Searchbar
        placeholder="¿A dónde quieres ir hoy?"
        autoCapitalize="none"
        autoCorrect={false}
        onEndEditing={handleSearch}
      />
    </BaseHeader>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    height: "auto",
    marginHorizontal: 10,
    marginBottom: 10,
  },
})

export default Header
