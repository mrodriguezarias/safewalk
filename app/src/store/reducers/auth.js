import authActions from "../actions/auth"

const initialState = {
  logged: false,
  user: null,
}

const load = (state, newState) => ({ ...state, ...newState })
const signUp = (state, { user }) => ({ ...state, logged: true, user })
const logIn = (state, { user }) => ({ ...state, logged: true, user })
const logOut = (state) => ({ ...state, logged: false, user: null })
const edit = (state, { user }) => ({ ...state, user })

const authReducer = (state = initialState, action) => {
  const { type, payload = {} } = action
  switch (type) {
    case authActions.LOAD:
      return load(state, payload)
    case authActions.SIGNUP:
      return signUp(state, payload)
    case authActions.LOGIN:
      return logIn(state, payload)
    case authActions.LOGOUT:
      return logOut(state, payload)
    case authActions.EDIT:
      return edit(state, payload)
    default:
      return state
  }
}

export default authReducer
