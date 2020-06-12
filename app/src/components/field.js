import React from "react"
import { StyleSheet } from "react-native"
import { Field as FormField } from "redux-form"
import { Text, Item, Label, Input, View, Icon } from "native-base"
import generalUtils from "../utils/general"

const renderInput = generalUtils.memoize(
  (inputProps) => ({
    input: { onChange, ...restInput },
    label,
    meta: { touched, error },
  }) => {
    return (
      <View style={styles.container}>
        <Item floatingLabel error={touched && !!error} last>
          <Label>{label}</Label>
          <Input
            autoCapitalize="none"
            onChangeText={onChange}
            {...restInput}
            {...inputProps}
          />
        </Item>
        {touched && !!error && (
          <View style={styles.errorContainer}>
            <Icon type="Ionicons" name="alert" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  errorIcon: {
    color: "#f00",
    fontSize: 24,
    marginRight: 5,
  },
  errorText: {
    color: "#f00",
  },
  container: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
})

export default Field
