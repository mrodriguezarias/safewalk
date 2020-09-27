import React, { forwardRef } from "react"
import { StyleSheet } from "react-native"
import { Searchbar as RNSearchbar } from "react-native-paper"

const SearchBar = forwardRef((props, ref) => {
  return (
    <RNSearchbar
      ref={ref}
      autoCapitalize="none"
      autoCorrect={false}
      style={styles.search}
      {...props}
    />
  )
})

const styles = StyleSheet.create({
  search: {
    borderRadius: 0,
    height: 60,
    paddingLeft: 5,
  },
})

export default SearchBar
