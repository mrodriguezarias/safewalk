import React from "react"
import { Admin, Resource, Login } from "react-admin"

import authProvider from "./providers/auth"
import dataProvider from "./providers/data"
import i18nProvider from "./providers/i18n"

import userResource from "./resources/user"
import categoryResource from "./resources/category"
import placeResource from "./resources/place"
import walkResource from "./resources/walk"
import zoneResource from "./resources/zone"
import contactResource from "./resources/contact"

const LoginPage = () => <Login />

const App = () => {
  return (
    <Admin
      title="Panel de Control de SafeWalk"
      loginPage={LoginPage}
      authProvider={authProvider()}
      dataProvider={dataProvider()}
      i18nProvider={i18nProvider()}
    >
      <Resource
        name="users"
        options={{ label: "Usuarios" }}
        icon={userResource.icon}
        list={userResource.list}
        edit={userResource.edit}
        create={userResource.create}
      />
      <Resource
        name="places"
        options={{ label: "Lugares" }}
        icon={placeResource.icon}
        list={placeResource.list}
        edit={placeResource.edit}
        create={placeResource.create}
      />
      <Resource
        name="categories"
        options={{ label: "Categorías" }}
        icon={categoryResource.icon}
        list={categoryResource.list}
        edit={categoryResource.edit}
        create={categoryResource.create}
      />
      <Resource
        name="contacts"
        options={{ label: "Contactos" }}
        icon={contactResource.icon}
        list={contactResource.list}
        edit={contactResource.edit}
        create={contactResource.create}
      />
      <Resource
        name="walks"
        options={{ label: "Recorridos" }}
        icon={walkResource.icon}
        list={walkResource.list}
        edit={walkResource.edit}
      />
      <Resource
        name="zones"
        options={{ label: "Zonas" }}
        icon={zoneResource.icon}
        list={zoneResource.list}
        edit={zoneResource.edit}
        create={zoneResource.create}
      />
      {/* <Resource
        name="nodes"
        options={{ label: "Nodos" }}
        icon={nodeResource.icon}
        list={nodeResource.list}
        edit={nodeResource.edit}
        create={nodeResource.create}
      /> */}
      {/* <Resource
        name="paths"
        options={{ label: "Caminos" }}
        icon={pathResource.icon}
        list={pathResource.list}
      /> */}
    </Admin>
  )
}

export default App
