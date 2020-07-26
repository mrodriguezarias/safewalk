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
  regex,
} from "react-admin"
import UserIcon from "@material-ui/icons/Group"

const validations = {
  name: [required(), minLength(4), maxLength(16)],
  phone: [
    minLength(10),
    maxLength(20),
    regex(/^\+?\d+$/, "Must be a valid phone number"),
  ],
  password: [minLength(8), maxLength(32)],
}

const UserList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <BooleanField source="admin" />
      <BooleanField source="premium" />
    </Datagrid>
  </List>
)

const UserTitle = ({ record }) => (
  <span>User {record ? `"${record.name}"` : ""}</span>
)

const UserEdit = (props) => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <TextInput source="name" validate={validations.name} />
      <PasswordInput source="password" validate={validations.password} />
      <TextInput source="phone" validate={validations.phone} />
      <BooleanInput source="admin" />
      <BooleanInput source="premium" />
    </SimpleForm>
  </Edit>
)

const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect="list">
      <TextInput source="name" validate={validations.name} />
      <PasswordInput
        source="password"
        validate={[...validations.password, required()]}
      />
      <TextInput source="phone" validate={validations.phone} />
      <BooleanInput source="admin" />
      <BooleanInput source="premium" />
    </SimpleForm>
  </Create>
)

const userResource = {
  icon: UserIcon,
  list: UserList,
  edit: UserEdit,
  create: UserCreate,
}

export default userResource
