const geoUtils = {
  getDistance: (locA, locB = { longitude: 0, latitude: 0 }) => {
    const dLong = locA.longitude - locB.longitude
    const dLat = locA.latitude - locB.latitude
    return (dLong ** 2 + dLat ** 2) ** (1 / 2)
  },
}

export default geoUtils
