import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Searchbar } from "react-native-paper"
import DismissKeyboard from "../../components/dismissKeyboard"

const NewContactScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const onChangeSearch = (query) => setSearchQuery(query)

  return (
    <DismissKeyboard>
      <View style={styles.centered}>
        <Searchbar
          placeholder="Buscar Usuario"
          onChangeText={onChangeSearch}
          value={searchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.search}
        />
      </View>
    </DismissKeyboard>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
  },
  search: {
    borderRadius: 0,
  },
})

export default NewContactScreen
