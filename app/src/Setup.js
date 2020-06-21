import React from "react"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider as StoreProvider } from "react-redux"
import ReduxThunk from "redux-thunk"
import { reducer as formReducer } from "redux-form"

import App from "./App"
import appReducer from "./store/reducers/app"
import authReducer from "./store/reducers/auth"
import envUtils from "../../shared/utils/env"

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  form: formReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

envUtils.load("app")

const Setup = () => (
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
)

export default Setup
