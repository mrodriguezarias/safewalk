import storageUtils from "../../../../shared/utils/storage"

const walkActions = {
  LOAD: "WALK/LOAD",
  SET_LOCATION: "WALK/SET_LOCATION",
  SWAP_LOCATIONS: "WALK/SWAP_LOCATIONS",
  SET_PATH: "WALK/SET_PATH",
  MARK_PLACE: "WALK/MARK_PLACE",
  UNMARK_PLACE: "WALK/UNMARK_PLACE",
  SET_WALK: "WALK/SET_WALK",
  load: (state) => ({ type: walkActions.LOAD, payload: state }),
  setSource: (source) => ({
    type: walkActions.SET_SOURCE,
    payload: { source },
  }),
  setLocation: (key, location) => ({
    type: walkActions.SET_LOCATION,
    payload: { key, location },
  }),
  swapLocations: () => ({
    type: walkActions.SWAP_LOCATIONS,
  }),
  setPath: (path) => ({
    type: walkActions.SET_PATH,
    payload: { path },
  }),
  markPlace: (place) => ({
    type: walkActions.MARK_PLACE,
    payload: { place },
  }),
  unmarkPlace: (place) => ({
    type: walkActions.UNMARK_PLACE,
    payload: { place },
  }),
  setWalk: (walk) => async (dispatch) => {
    await storageUtils.set("walk", walk)
    dispatch({ type: walkActions.SET_WALK, payload: { walk } })
  },
}

export default walkActions
