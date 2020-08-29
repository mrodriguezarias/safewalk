import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import geoUtils from "../../utils/geo"
import walkController from "../../../../shared/controllers/walk"
import walkActions from "../../store/actions/walk"

const UPDATE_INTERVAL = 10 // seconds

const LocationTracker = () => {
  const walkId = useSelector((state) => state.walk.walk?.id)
  const walked = useSelector((state) => state.walk.walk?.walked)
  const mockLocation = useSelector((state) => state.app.mockLocation)
  const dispatch = useDispatch()
  const interval = useRef()

  useEffect(() => {
    clearInterval(interval.current)
    if (!walkId) {
      return
    }
    interval.current = setInterval(updateLocation, UPDATE_INTERVAL * 1000)
    return () => clearInterval(interval.current)
  }, [walkId, mockLocation])

  const updateLocation = async () => {
    const position = await getCurrentLocation()
    const walk = await walkController.updatePosition(walkId, walked, position)
    dispatch(walkActions.setWalk(walk))
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
