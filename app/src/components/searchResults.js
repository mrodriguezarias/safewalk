import React, { Fragment, useState } from "react"
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native"
import { Paragraph } from "react-native-paper"
import _ from "lodash"

import Spinner from "./spinner"

const SearchResults = ({
  results = [],
  loading = false,
  noResults,
  renderItem,
  onRefresh,
}) => {
  const [refreshing, setRefreshing] = useState(false)

  const renderNoResults = () => {
    if (loading || results.length > 0 || !noResults) {
      return null
    }
    let nores = noResults
    if (!Array.isArray(noResults)) {
      nores = [_.isString(noResults) ? noResults : "Sin Resultados"]
    }
    return (
      <View style={styles.noResultsContainer}>
        {nores.map((item, index) => (
          <Paragraph style={styles.noResults} key={index}>
            {item}
          </Paragraph>
        ))}
      </View>
    )
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh && (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        )
      }
    >
      {loading && !refreshing ? (
        <Spinner style={styles.spinner} />
      ) : (
        results.map((result, index) => (
          <Fragment key={index}>{renderItem && renderItem(result)}</Fragment>
        ))
      )}
      {renderNoResults()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 20,
  },
  noResultsContainer: {
    marginVertical: 25,
  },
  noResults: {
    marginBottom: 10,
    paddingHorizontal: 30,
    color: "grey",
    textAlign: "center",
  },
})

export default SearchResults
