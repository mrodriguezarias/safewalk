import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import geoUtils from "../../utils/geo"
import walkController from "../../../../shared/controllers/walk"
import walkActions from "../../store/actions/walk"

const UPDATE_INTERVAL = 5 // seconds

const LocationTracker = () => {
  const walkId = useSelector((state) => state.walk.walk?.id)
  const mockLocation = useSelector((state) => state.app.mockLocation)
  const dispatch = useDispatch()
  const interval = useRef()

  useEffect(() => {
    clearInterval(interval.current)
    if (!walkId) {
      return
    }
    updateLocation()
    interval.current = setInterval(updateLocation, UPDATE_INTERVAL * 1000)
    return () => clearInterval(interval.current)
  }, [walkId, mockLocation])

  const updateLocation = async () => {
    try {
      const position = await getCurrentLocation()
      const walk = await walkController.updatePosition(walkId, position)
      dispatch(walkActions.setWalk(walk))
    } catch {}
  }

  const getCurrentLocation = async () => {
    let coords
    if (mockLocation) {
      coords = mockLocation
    } else {
      coords = await geoUtils.getCurrentLocation({
        highAccuracy: true,
      })
    }
    return coords
  }

  return null
}

export default LocationTracker
