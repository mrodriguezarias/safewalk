import React from "react"
import { Admin, Resource, Login } from "react-admin"
import UserIcon from "@material-ui/icons/Group"

import authProvider from "./providers/auth"
import dataProvider from "./providers/data"
import userResource from "./resources/user"

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
    </Admin>
  )
}

export default App
