import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { TextInput, HelperText } from "react-native-paper"
import { Field as FormField } from "react-final-form"

const getValidator = (validate) => {
  if (!validate) {
    return undefined
  }
  if (Array.isArray(validate)) {
    return (value) =>
      validate.reduce(
        (error, validator) => error || validator(value),
        undefined,
      )
  }
  return validate
}

const Field = ({ name, label, validate, onBlur, ...inputProps }) => {
  const [touched, setTouched] = useState(false)

  const handleOnBlur = (name, value, valid) => {
    setTouched(true)
    if (onBlur) {
      onBlur({ name, value, valid })
    }
  }

  return (
    <FormField
      name={name}
      label={label}
      validate={getValidator(validate)}
      render={(props) => {
        const {
          input: { onChange, value, ...restInput },
          meta: { error, valid },
        } = props
        return (
          <View style={styles.container}>
            <TextInput
              error={touched && !!error}
              autoCapitalize="none"
              autoCorrect={false}
              mode="outlined"
              label={label}
              onChangeText={onChange}
              value={value}
              {...restInput}
              {...inputProps}
              onBlur={() => handleOnBlur(name, value, valid)}
            />
            {touched && !!error && (
              <HelperText type="error">{error}</HelperText>
            )}
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
})

export default Field
