import React from "react"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"
import { StyleProvider, Root } from "native-base"
import { reducer as formReducer } from "redux-form"

import App from "./App"
import appReducer from "./store/reducers/app"
import authReducer from "./store/reducers/auth"
import getTheme from "./theme/components"
import commonColor from "./theme/variables/commonColor"
import envUtils from "../../shared/utils/env"

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  form: formReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

envUtils.load("app")

const Setup = () => (
  <Provider store={store}>
    <StyleProvider style={getTheme(commonColor)}>
      <Root>
        <App />
      </Root>
    </StyleProvider>
  </Provider>
)

export default Setup
