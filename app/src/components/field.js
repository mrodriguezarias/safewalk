import React from "react"
import { View, StyleSheet } from "react-native"
import { TextInput, HelperText } from "react-native-paper"
import { Field as FormField } from "redux-form"
import generalUtils from "../utils/general"

const renderInput = generalUtils.memoize(
  (inputProps) => ({
    input: { onChange, ...restInput },
    label,
    meta: { touched, error },
  }) => {
    return (
      <View style={styles.container}>
        <TextInput
          error={touched && !!error}
          autoCapitalize="none"
          autoCorrect={false}
          mode="outlined"
          label={label}
          onChangeText={onChange}
          {...restInput}
          {...inputProps}
        />
        {touched && !!error && <HelperText type="error">{error}</HelperText>}
      </View>
    )
  },
)

const Field = (props) => {
  const { name, label, validate, ...inputProps } = props
  return (
    <FormField
      name={name}
      label={label}
      validate={validate}
      component={renderInput(inputProps)}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
})

export default Field
