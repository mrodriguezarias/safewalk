import requestUtils from "../utils/request"
import generalUtils from "../utils/general"
import urlUtils from "../utils/url"
import _ from "lodash"

const APIS = {
  ADDRESSES:
    "https://ws.usig.buenosaires.gob.ar/rest/normalizar_y_geocodificar_direcciones",
  PLACES: "https://epok.buenosaires.gob.ar/buscar",
  PLACE: "https://epok.buenosaires.gob.ar/getObjectContent",
  COORDS: "https://ws.usig.buenosaires.gob.ar/rest/convertir_coordenadas",
  NEARBY: "https://epok.buenosaires.gob.ar/reverseGeocoderLugares",
}

const CATEGORIES = [
  "academias_de_espanol",
  "actividades_para_chicos",
  "actores_sociales",
  "agencias_de_viajes",
  "alojamientos",
  "bancos",
  "bar_accesible",
  "campanas_verdes",
  "carnicerias_saludables",
  "centros_comerciales",
  "centros_de_informes",
  "centros_integracion_laboral",
  "centros_de_prevencion",
  "centros_de_recreacion",
  "centros_de_salud_no_dependientes_del_gcba",
  "centros_de_salud_y_accion_comunitaria",
  "cecie",
  "centros_medicos_barriales",
  "centros_vacunatorios",
  "clubes_de_barrio",
  "clubes_de_jazz",
  "colectividades",
  "comisarias",
  "compromisos_salud",
  "concursos_gastronomicos",
  "consulados",
  "cuarteles_de_bomberos",
  "cuc_establecimientos_educativos",
  "culturas_independientes",
  "dependencias_culturales",
  "fiscalias",
  "discotecas",
  "embajadas",
  "empleos_del_futuro_sedes",
  "empleos_del_futuro_sedes_custom",
  "empleos_del_futuro_talleres",
  "encuentro_con_ciencia_talleres",
  "espacios_familiares",
  "establecimientos_educativos_de_gestion_estatal",
  "establecimientos_educativos_de_gestion_privada",
  "estaciones_de_bicicletas",
  "estaciones_de_ferrocarril",
  "estaciones_de_metrobus",
  "estaciones_de_premetro",
  "estaciones_de_servicio",
  "estaciones_de_subte",
  "farmacias",
  "gastronomia",
  "hospitales_de_ninos",
  "hospitales_especializados",
  "hospitales_generales_de_agudos",
  "institutos_de_formacion_tecnica_superior",
  "lugares_de_esparcimiento",
  "oficinas_de_empleo",
  "patio_de_juego",
  "pistas_de_skate",
  "polideportivos",
  "pubs",
  "recuperadores_urbanos",
  "sedes_ABASTO",
  "sedes_de_comunas",
  "sedes_FIBA",
  "servicios_sociales",
  "sitios_de_interes",
  "universidades",
  "usina_del_arte",
]

const LIMIT = 10

const normalize = (location, address = true) => {
  if (address) {
    location = location.replace(/^(.+) AV\.?$/, "AV. $1")
    location = location.replace(/^(.+), (.+)$/, "$2 $1")
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
  for (const { id, nombre: name } of instances) {
    const {
      ubicacion: { centroide: pointLoc },
    } = await requestUtils.get(APIS.PLACE, { id })
    const [x, y] = pointLoc.match(/\d+\.\d+/g)
    const coords = await getLongLat({ x, y })
    if (!coords) {
      continue
    }
    const withinBoundary = await geoService.isWithinBoundary(coords)
    if (!withinBoundary) {
      continue
    }
    const place = {
      name: normalize(name, false),
      coords,
    }
    places = [...places, place]
  }
  return places
}

const geoService = {
  path: "/geo",
  searchAddress: async (query) => {
    const { streetName, streetNumber } = getAddressParts(query)
    const result = await requestUtils.get(APIS.ADDRESSES, {
      calle: streetName,
      altura: streetNumber,
      desambiguar: 1,
    })
    let name = null
    let coords = null
    if (result.Normalizacion.TipoResultado === "DireccionNormalizada") {
      const address =
        result.Normalizacion.DireccionesCalleAltura.direcciones?.[0]
      if (address) {
        name = `${normalize(address.Calle)} ${address.Altura}`
      } else {
        const address =
          result.Normalizacion.DireccionesCalleCalle.direcciones[0]
        name = `${normalize(address.Calle1)} y ${normalize(address.Calle2)}`
      }
      coords = await getLongLat(result.GeoCodificacion)
    }
    if (!name || !coords) {
      return null
    }
    const withinBoundary = await geoService.isWithinBoundary(coords)
    if (!withinBoundary) {
      return null
    }
    return { name, coords }
  },
  searchPlaces: async (query) => {
    const result = await requestUtils.get(APIS.PLACES, {
      texto: query,
      limit: LIMIT,
    })
    return getPlacesWithCoords(result?.instancias)
  },
  searchNearby: async (coords) => {
    const result = await requestUtils.get(APIS.NEARBY, {
      x: coords.x,
      y: coords.y,
      categorias: CATEGORIES.join(","),
      radio: 100,
    })
    const instances = _(result?.instancias)
      .sortBy("distancia")
      .take(LIMIT)
      .value()
    return getPlacesWithCoords(instances)
  },
  isWithinBoundary: async (coords) => {
    const { longitude, latitude } = coords
    const url = urlUtils.join(geoService.path, "withinBoundary")
    return requestUtils.post(url, {
      longitude,
      latitude,
    })
  },
  getSafestPath: async (source, target) => {
    const url = urlUtils.join(geoService.path, "safestPath")
    return requestUtils.post(url, {
      source,
      target,
    })
  },
}

export default geoService
