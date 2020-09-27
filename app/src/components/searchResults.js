import React, { Fragment } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { Paragraph } from "react-native-paper"
import _ from "lodash"

import Spinner from "./spinner"

const SearchResults = ({ results = [], loading, noResults, renderItem }) => {
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      {results.map((result, index) => (
        <Fragment key={index}>{renderItem && renderItem(result)}</Fragment>
      ))}
      <Spinner visible={loading} style={styles.spinner} />
      {noResults && (
        <Paragraph style={styles.noResults}>
          {_.isString(noResults) ? noResults : "Sin Resultados"}
        </Paragraph>
      )}
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
  noResults: {
    marginVertical: 20,
    paddingHorizontal: 30,
    color: "grey",
    textAlign: "center",
  },
})

export default SearchResults
