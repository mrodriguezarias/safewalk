import React from "react"
import { Admin, Resource, Login } from "react-admin"

import authProvider from "./providers/auth"
import dataProvider from "./providers/data"
import i18nProvider from "./providers/is18n"

import userResource from "./resources/user"
import carerResource from "./resources/carer"
import nodeResource from "./resources/node"
import pathResource from "./resources/path"
import categoryResource from "./resources/category"
import placeResource from "./resources/place"

const LoginPage = () => (
  <Login backgroundImage="https://source.unsplash.com/1600x900/?kitten" />
)

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
      {/* <Resource
        name="carers"
        options={{ label: "Cuidadores" }}
        icon={carerResource.icon}
        list={carerResource.list}
        edit={carerResource.edit}
        create={carerResource.create}
      /> */}
      {/* <Resource
        name="nodes"
        options={{ label: "Nodos" }}
        icon={nodeResource.icon}
        list={nodeResource.list}
        edit={nodeResource.edit}
        create={nodeResource.create}
      />
      <Resource
        name="paths"
        options={{ label: "Caminos" }}
        icon={pathResource.icon}
        list={pathResource.list}
      /> */}
    </Admin>
  )
}

export default App
