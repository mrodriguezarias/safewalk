import categoryService from "../api/src/services/category"
import dbUtils from "../shared/utils/db"
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

const uploadCategories = {
  name: "upload_categories",
  run: async (args) => {
    await dbUtils.connect(true)
    try {
      await uploadCategories.doUpload()
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
  doUpload: async () => {
    const categoryNames = Array.from(categories.values())
    console.info("Deleting preexisting categories…")
    await categoryService.deleteAllCategories()
    for (const [index, name] of categoryNames.entries()) {
      uploadCategories.printUploadProgress(index)
      await categoryService.createCategory({ name })
    }
  },
  printUploadProgress: (index) => {
    const current = index + 1
    const total = categories.size
    consoleUtils.printProgress("Adding category", current, total)
  },
}

export default uploadCategories
