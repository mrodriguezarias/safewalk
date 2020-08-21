import fs from "fs"
import dbUtils from "../shared/utils/db"
import placeService from "../api/src/services/place"
import categoryService from "../api/src/services/category"
import consoleUtils from "../shared/utils/console"

const categories = new Map([
  ["bar", "Bar"],
  ["cafe", "Cafetería"],
  ["fast_food", "Comida rápida"],
  ["ice_cream", "Heladería"],
  ["pub", "Pub"],
  ["restaurant", "Restorán"],
  ["college", "Instituto"],
  ["kindergarten", "Jardín de infantes"],
  ["language_school", "Escuela de idiomas"],
  ["library", "Biblioteca"],
  ["school", "Escuela"],
  ["university", "Universidad"],
  ["bus_station", "Estación de autobús"],
  ["bank", "Banco"],
  ["bureau_de_change", "Casa de cambio"],
  ["clinic", "Clínica"],
  ["dentist", "Dentista"],
  ["doctors", "Centro médico"],
  ["hospital", "Hospital"],
  ["pharmacy", "Farmacia"],
  ["veterinary", "Veterinaria"],
  ["arts_centre", "Centro de arte"],
  ["casino", "Casino"],
  ["cinema", "Cine"],
  ["planetarium", "Planetario"],
  ["theatre", "Teatro"],
  ["fire_station", "Bomberos"],
  ["marketplace", "Mercado"],
  ["place_of_worship", "Iglesia"],
  ["police", "Policía"],
  ["post_office", "Oficina de correo"],
  ["townhall", "Sede comunal"],
  ["fitness_centre", "Gimnasio"],
  ["garden", "Jardín"],
  ["park", "Parque"],
  ["stadium", "Estadio"],
  ["station", "Estación"],
  ["bakery", "Panadería"],
  ["butcher", "Carnicería"],
  ["convenience", "Tienda de conveniencia"],
  ["greengrocer", "Verdulería"],
  ["health_food", "Dietética"],
  ["pasta", "Casa de pastas"],
  ["pastry", "Repostería"],
  ["seafood", "Pescadería"],
  ["department_store", "Compras"],
  ["kiosk", "Quiosco"],
  ["mall", "Centro comercial"],
  ["supermarket", "Supermercado"],
  ["clothes", "Tienda de ropa"],
  ["fashion_accessories", "Artículos de moda"],
  ["jewelry", "Joyería"],
  ["sewing", "Mercería"],
  ["tailor", "Sastrería"],
  ["watches", "Relojería"],
  ["beauty", "Belleza"],
  ["chemist", "Droguería"],
  ["cosmetics", "Cosméticos"],
  ["hairdresser", "Peluquería"],
  ["optician", "Óptica"],
  ["perfumery", "Perfumería"],
  ["tattoo", "Tatuajes"],
  ["electrical", "Electricidad"],
  ["florist", "Florería"],
  ["hardware", "Ferretería"],
  ["locksmith", "Cerrajería"],
  ["paint", "Pinturería"],
  ["antiques", "Antigüedades"],
  ["bed", "Camas"],
  ["furniture", "Mueblería"],
  ["lighting", "Iluminación"],
  ["computer", "Computación"],
  ["electronics", "Electrónica"],
  ["mobile_phone", "Celulares"],
  ["bicycle", "Bicicletería"],
  ["car", "Automóviles"],
  ["fuel", "Estación de servicio"],
  ["motorcycle", "Motocicletas"],
  ["outdoor", "Aire libre"],
  ["stationery", "Librería"],
  ["dry_cleaning", "Tintorería"],
  ["laundry", "Lavandería"],
  ["pet", "Tienda de mascotas"],
  ["toys", "Juguetería"],
])

const uploadPlaces = {
  name: "upload_places",
  percentSafe: 0.3,
  run: async (args) => {
    const path = uploadPlaces.parseArgs(args)
    const places = uploadPlaces.parseFile(path)
    await uploadPlaces.uploadToDatabase(places)
  },
  parseArgs: (args) => {
    const path = args._?.[1] ?? "./data/places.json"
    if (!fs.existsSync(path)) {
      throw Error(`file '${path}' does not exist`)
    }
    return path
  },
  parseFile: (path) => {
    console.info("Parsing file…")
    const data = fs.readFileSync(path)
    return JSON.parse(data)
  },
  uploadToDatabase: async (places) => {
    await dbUtils.connect(true)
    try {
      console.info("Deleting preexisting places…")
      await placeService.deleteAllPlaces()
      for (const [index, place] of places.entries()) {
        consoleUtils.printProgress("Adding place", index + 1, places.length)
        const category = await categoryService.getCategoryByName(
          categories.get(place.category),
        )
        const data = {
          name: place.name,
          category: category.id,
          longitude: place.coords.longitude,
          latitude: place.coords.latitude,
          safe: uploadPlaces.isSafe(),
        }
        await placeService.createPlace(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
  isSafe: () => {
    const r = Math.random()
    return r < uploadPlaces.percentSafe
  },
}

export default uploadPlaces
