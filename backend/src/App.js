import React from "react"
import { Admin, Resource, Login } from "react-admin"

import authProvider from "./providers/auth"
import dataProvider from "./providers/data"

import userResource from "./resources/user"
import carerResource from "./resources/carer"
import nodeResource from "./resources/node"
import pathResource from "./resources/path"

const LoginPage = () => (
  <Login backgroundImage="https://source.unsplash.com/1600x900/?kitten" />
)

const App = () => {
  return (
    <Admin
      title="Safewalk Backend"
      loginPage={LoginPage}
      authProvider={authProvider()}
      dataProvider={dataProvider()}
    >
      <Resource
        name="users"
        icon={userResource.icon}
        list={userResource.list}
        edit={userResource.edit}
        create={userResource.create}
      />
      <Resource
        name="carers"
        icon={carerResource.icon}
        list={carerResource.list}
        edit={carerResource.edit}
        create={carerResource.create}
      />
      <Resource
        name="nodes"
        icon={nodeResource.icon}
        list={nodeResource.list}
        edit={nodeResource.edit}
        create={nodeResource.create}
      />
      <Resource
        name="paths"
        icon={pathResource.icon}
        list={pathResource.list}
      />
    </Admin>
  )
}

export default App
