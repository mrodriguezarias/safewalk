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
  Filter,
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

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Buscar" source="q" alwaysOn />
  </Filter>
)

const UserList = (props) => (
  <List
    perPage={25}
    sort={{ field: "name", order: "ASC" }}
    title="Lista de Usuarios"
    filters={<UserFilter />}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="Nombre" />
      <BooleanField source="admin" />
      <BooleanField source="premium" />
      <BooleanField source="blocked" label="Bloqueado" />
    </Datagrid>
  </List>
)

const UserTitle = ({ record }) => (
  <span>Usuario {record ? `"${record.name}"` : ""}</span>
)

const UserEdit = (props) => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <TextInput source="name" label="Nombre" validate={validations.name} />
      <PasswordInput
        source="password"
        label="Contraseña"
        validate={validations.password}
      />
      <TextInput source="phone" label="Teléfono" validate={validations.phone} />
      <BooleanInput source="admin" />
      <BooleanInput source="premium" />
      <BooleanInput source="blocked" label="Bloqueado" />
      <TextInput source="pushToken" label="Push Token" />
    </SimpleForm>
  </Edit>
)

const UserCreate = (props) => (
  <Create title="Crear Usuario" {...props}>
    <SimpleForm redirect="list">
      <TextInput source="name" label="Nombre" validate={validations.name} />
      <PasswordInput
        source="password"
        label="Contraseña"
        validate={[...validations.password, required()]}
      />
      <TextInput source="phone" label="Teléfono" validate={validations.phone} />
      <BooleanInput source="admin" />
      <BooleanInput source="premium" />
      <BooleanInput source="blocked" label="Bloqueado" />
      <TextInput source="pushToken" label="Push Token" />
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
