const walkActions = {
  LOAD: "WALK/LOAD",
  SET_SOURCE: "WALK/SET_SOURCE",
  SET_TARGET: "WALK/SET_TARGET",
  load: (state) => ({ type: walkActions.LOAD, payload: state }),
  setSource: (source) => ({
    type: walkActions.SET_SOURCE,
    payload: { source },
  }),
  setTarget: (target) => ({
    type: walkActions.SET_TARGET,
    payload: { target },
  }),
}

export default walkActions
