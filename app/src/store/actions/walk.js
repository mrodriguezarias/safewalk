import geoUtils from "../../utils/geo"

const walkActions = {
  LOAD: "WALK/LOAD",
  SET_LOCATION: "WALK/SET_LOCATION",
  SWAP_LOCATIONS: "WALK/SWAP_LOCATIONS",
  load: (state) => ({ type: walkActions.LOAD, payload: state }),
  setSource: (source) => ({
    type: walkActions.SET_SOURCE,
    payload: { source },
  }),
  setLocation: (key, location) => ({
    type: walkActions.SET_LOCATION,
    payload: { key, location },
  }),
  setCurrentLocation: (key) => async (dispatch) => {
    const coords = await geoUtils.getCurrentLocation()
    const location = {
      name: "Ubicación actual",
      coords,
    }
    dispatch({
      type: walkActions.SET_LOCATION,
      payload: { key, location },
    })
  },
  swapLocations: () => ({
    type: walkActions.SWAP_LOCATIONS,
  }),
}

export default walkActions
