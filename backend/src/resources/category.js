import React from "react"
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  required,
  minLength,
  maxLength,
} from "react-admin"
import CategoryIcon from "@material-ui/icons/Label"

const validations = {
  name: [required(), minLength(4), maxLength(16)],
}

const CategoryList = (props) => (
  <List
    perPage={25}
    sort={{ field: "name", order: "ASC" }}
    title="Lista de Categorías"
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="Nombre" />
    </Datagrid>
  </List>
)

const CategoryTitle = ({ record }) => (
  <span>Categoría {record ? `"${record.name}"` : ""}</span>
)

const CategoryEdit = (props) => (
  <Edit title={<CategoryTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <TextInput source="name" label="Nombre" validate={validations.name} />
    </SimpleForm>
  </Edit>
)

const CategoryCreate = (props) => (
  <Create title="Crear Categoría" {...props}>
    <SimpleForm redirect="list">
      <TextInput source="name" label="Nombre" validate={validations.name} />
    </SimpleForm>
  </Create>
)

const categoryResource = {
  icon: CategoryIcon,
  list: CategoryList,
  edit: CategoryEdit,
  create: CategoryCreate,
}

export default categoryResource
