import requestUtils from "../utils/request"
import generalUtils from "../utils/general"
import urlUtils from "../utils/url"
import GeoError from "../errors/geo"
import _ from "lodash"

const APIS = {
  ADDR2COORD:
    "https://ws.usig.buenosaires.gob.ar/rest/normalizar_y_geocodificar_direcciones",
  COORD2ADDR: "http://ws.usig.buenosaires.gob.ar/geocoder/2.2/reversegeocoding",
  COORDS: "https://ws.usig.buenosaires.gob.ar/rest/convertir_coordenadas",
}

const LIMIT = 10

const normalize = (location, address = true) => {
  if (address) {
    location = location.replace(/^(.+) AV\.?$/, "AV. $1")
    location = location.replace(/^(.+), (.+)$/, "$2 $1")
    location = location.toLowerCase()
  }
  return generalUtils.titleCase(location)
}

const castCoords = (coords) => {
  return coords ? { longitude: +coords.x, latitude: +coords.y } : null
}

const getAddressParts = (address) => {
  const streetName = address.replace(/\s\d+.*$/, "")
  const streetNumber = address.match(/\s(\d+)(?:\s|$)/)?.[1] ?? ""
  return { streetName, streetNumber }
}

const getLongLat = async (coords) => {
  const { tipo_resultado: status, resultado: longLat } = await requestUtils.get(
    APIS.COORDS,
    {
      x: coords.x,
      y: coords.y,
      output: "lonlat",
    },
  )
  if (status !== "Ok") {
    return null
  }
  return castCoords(longLat)
}

const getPlacesWithCoords = async (instances) => {
  let places = []
  for (const [index, data] of instances.entries()) {
    const { name, longitude, latitude, safe, category, id, address } = data
    const coords = {
      longitude,
      latitude,
    }
    if (index === 0) {
      await geoService.isWithinBoundary(coords)
    }
    const place = {
      name: normalize(name, false),
      coords,
      safe,
      category,
      index,
      id,
      address,
    }
    places = [...places, place]
  }
  places = _.orderBy(places, ["safe", "index"], ["desc", "asc"])
  places = _.map(places, (place) => _.omit(place, ["index"]))
  return places
}

const geoService = {
  path: "/geo",
  searchAddress: async (query) => {
    const { streetName, streetNumber } = getAddressParts(query)
    const result = await requestUtils.get(APIS.ADDR2COORD, {
      calle: streetName,
      altura: streetNumber,
      desambiguar: 1,
    })
    let name = null
    let category
    let coords = null
    if (result.Normalizacion.TipoResultado === "DireccionNormalizada") {
      const address =
        result.Normalizacion.DireccionesCalleAltura.direcciones?.[0]
      if (address) {
        name = `${normalize(address.Calle)} ${address.Altura}`
        category = "Calle"
      } else {
        const address =
          result.Normalizacion.DireccionesCalleCalle.direcciones[0]
        name = `${normalize(address.Calle1)} y ${normalize(address.Calle2)}`
        category = "Intersección"
      }
      coords = await getLongLat(result.GeoCodificacion)
    }
    if (!name || !coords) {
      return null
    }
    await geoService.isWithinBoundary(coords)
    return { name, coords, category, id: name }
  },
  searchNearby: async (location, query) => {
    const result = await requestUtils.post("/geo/nearbyPlaces", {
      location,
      query,
      limit: LIMIT,
    })
    return getPlacesWithCoords(result)
  },
  getAddressOfLocation: async (coords) => {
    const result = await requestUtils.get(APIS.COORD2ADDR, {
      x: coords.longitude,
      y: coords.latitude,
    })
    if (!result || !result.puerta) {
      return null
    }
    const { streetName, streetNumber } = getAddressParts(result.puerta)
    const address = `${normalize(streetName)} ${streetNumber}`
    return address
  },
  isWithinBoundary: async (coords) => {
    const { longitude, latitude } = coords
    const url = urlUtils.join(geoService.path, "withinBoundary")
    const withinBoundary = await requestUtils.post(url, {
      longitude,
      latitude,
    })
    if (!withinBoundary) {
      throw new GeoError(
        "De momento solo proveemos servicio dentro de la Ciudad de Buenos Aires.",
      )
    }
  },
  getSafestPath: async (source, target) => {
    const url = urlUtils.join(geoService.path, "safestPath")
    return requestUtils.post(url, {
      source,
      target,
    })
  },
  getRelatedPlaces: async (place) => {
    let places = await requestUtils.post("/geo/nearbyPlaces", {
      location: place.coords,
      distance: 500,
    })
    places = places.filter(
      ({ category, id }) => category === place.category && id !== place.id,
    )
    places = _.take(places, LIMIT)
    return getPlacesWithCoords(places)
  },
}

export default geoService
