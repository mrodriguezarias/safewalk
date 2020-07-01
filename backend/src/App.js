import React from "react"
import { Admin, Resource, Login } from "react-admin"
import UserIcon from "@material-ui/icons/Group"
import ContactsIcon from "@material-ui/icons/Contacts"

import authProvider from "./providers/auth"
import dataProvider from "./providers/data"

import userResource from "./resources/user"
import carerResource from "./resources/carer"

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
        icon={UserIcon}
        list={userResource.list}
        edit={userResource.edit}
        create={userResource.create}
      />
      <Resource
        name="carers"
        icon={ContactsIcon}
        list={carerResource.list}
        edit={carerResource.edit}
        create={carerResource.create}
      />
    </Admin>
  )
}

export default App
