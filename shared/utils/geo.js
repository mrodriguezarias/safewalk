const degreesToRadians = (degrees) => {
  return (degrees * Math.PI) / 180
}

const geoUtils = {
  getRawDistance: (pos1, pos2 = { longitude: 0, latitude: 0 }) => {
    const dLong = pos1.longitude - pos2.longitude
    const dLat = pos1.latitude - pos2.latitude
    return (dLong ** 2 + dLat ** 2) ** (1 / 2)
  },
  getRealDistance: (pos1, pos2) => {
    let { longitude: lon1, latitude: lat1 } = pos1
    let { longitude: lon2, latitude: lat2 } = pos2
    const earthRadiusKm = 6371
    const dLat = degreesToRadians(lat2 - lat1)
    const dLon = degreesToRadians(lon2 - lon1)
    lat1 = degreesToRadians(lat1)
    lat2 = degreesToRadians(lat2)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return earthRadiusKm * c * 1000
  },
  pointsAreEqual: (pos1, pos2) => {
    return (
      pos1?.longitude === pos2?.longitude && pos1?.latitude === pos2?.latitude
    )
  },
  pointsAreNear: (pos1, pos2, distance = 100) => {
    return geoUtils.getRealDistance(pos1, pos2) < distance
  },
  closestToPoint: (point, path) => {
    const distances = path.map((pos) => geoUtils.getRawDistance(pos, point))
    const minIndex = distances.reduce(
      (prev, cur, idx) => (cur < prev[1] ? [idx, cur] : prev),
      [-1, Infinity],
    )[0]
    return path[minIndex]
  },
  getRealDistanceToPath: (point, path) => {
    const closest = geoUtils.closestToPoint(point, path)
    return geoUtils.getRealDistance(point, closest)
  },
  isNearPath: (point, path, distance = 100) => {
    const closest = geoUtils.closestToPoint(point, path)
    return geoUtils.pointsAreNear(point, closest)
  },
}

export default geoUtils
