import React from "react"
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  Edit,
  SimpleForm,
  BooleanInput,
  TextInput,
  PasswordInput,
  Create,
  required,
  minLength,
  maxLength,
} from "react-admin"

const validations = {
  name: [required(), minLength(4), maxLength(16)],
  password: [minLength(8), maxLength(32)],
}

const UserList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <BooleanField source="admin" />
    </Datagrid>
  </List>
)

const UserTitle = ({ record }) => (
  <span>User {record ? `"${record.name}"` : ""}</span>
)

const UserEdit = (props) => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" validate={validations.name} />
      <PasswordInput source="password" validate={validations.password} />
      <BooleanInput source="admin" />
    </SimpleForm>
  </Edit>
)

const UserCreate = (props) => (
  <Create title={<UserTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput source="name" validate={validations.name} />
      <PasswordInput
        source="password"
        validate={[...validations.password, required()]}
      />
      <BooleanInput source="admin" />
    </SimpleForm>
  </Create>
)

const userResource = {
  list: UserList,
  edit: UserEdit,
  create: UserCreate,
}

export default userResource
