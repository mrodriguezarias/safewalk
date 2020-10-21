import { useEffect, useRef } from "react"
import walkController from "../../../../shared/controllers/walk"

const UPDATE_INTERVAL = 5 // seconds

const WalkTracker = ({ walk, setWalk, focused }) => {
  const ended = !!walk.end
  const interval = useRef()

  useEffect(() => {
    resetInterval()
    if (!focused || ended) {
      return
    }
    interval.current = setInterval(updateWalk, UPDATE_INTERVAL * 1000)
    return () => {
      resetInterval()
    }
  }, [focused, ended])

  const resetInterval = () => {
    clearInterval(interval.current)
    interval.current = null
  }

  const updateWalk = async () => {
    if (!walk || !walk.id) {
      return
    }
    const updatedWalk = await walkController.get(walk.id)
    if (interval.current !== null && setWalk) {
      setWalk(updatedWalk)
    }
  }

  return null
}

export default WalkTracker
