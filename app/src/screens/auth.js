import React, { useState } from "react"
import { StyleSheet } from "react-native"
import {
  Container,
  Header,
  Button,
  Text,
  Body,
  Form,
  Title,
  Left,
  Right,
  Content,
  View,
} from "native-base"
import { useDispatch } from "react-redux"
import { reduxForm } from "redux-form"

import authActions from "../store/actions/auth"
import Field from "../components/field"
import validationUtils from "../utils/validation"
import uiUtils from "../utils/ui"
import authController from "../../../shared/controllers/auth"

const titles = {
  default: "Iniciar Sesión",
  logIn: "Iniciando Sesión…",
  signUp: "Registrando…",
}

const AuthScreen = ({ handleSubmit }) => {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(titles.default)
  const dispatch = useDispatch()

  const doSubmit = (action) => async ({ name, password }) => {
    if (!name || !password) {
      return
    }
    setLoading(true)
    setTitle(titles[action])
    try {
      const user = await authController[action](name, password)
      dispatch(authActions[action](user))
    } catch (error) {
      uiUtils.showError(error.message)
    }
    setLoading(false)
    setTitle(titles.default)
  }

  return (
    <Container>
      <Header>
        <Left />
        <Body style={{ flex: 3 }}>
          <Title>{title}</Title>
        </Body>
        <Right />
      </Header>
      <Content padder>
        <Form>
          <Field
            name="name"
            label="Nombre"
            editable={!loading}
            validate={[
              validationUtils.required(),
              validationUtils.minLength(4),
              validationUtils.maxLength(16),
            ]}
          />
          <Field
            name="password"
            label="Contraseña"
            secureTextEntry
            editable={!loading}
            validate={[
              validationUtils.required(),
              validationUtils.minLength(8),
              validationUtils.maxLength(32),
            ]}
          />
          <View style={styles.buttons}>
            <Button
              rounded
              bordered
              light
              primary
              style={styles.button}
              onPress={handleSubmit(doSubmit("signUp"))}
              disabled={loading}
            >
              <Text>Registrarse</Text>
            </Button>
            <Button
              rounded
              primary
              style={styles.button}
              onPress={handleSubmit(doSubmit("logIn"))}
              disabled={loading}
            >
              <Text>Iniciar Sesión</Text>
            </Button>
          </View>
        </Form>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 5,
    justifyContent: "space-between",
  },
  button: {
    width: 165,
    justifyContent: "center",
  },
})

export default reduxForm({
  form: "auth",
})(AuthScreen)
