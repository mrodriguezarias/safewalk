import React from "react"
import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  ReferenceField,
  DateTimeInput,
  Edit,
  SimpleForm,
  BooleanInput,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin"
import WalkIcon from "@material-ui/icons/DirectionsWalk"

const WalkList = (props) => (
  <List
    perPage={25}
    sort={{ field: "start", order: "ASC" }}
    title="Lista de Recorridos"
    {...props}
  >
    <Datagrid rowClick="edit">
      <ReferenceField label="Usuario" source="user" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="start" label="Inicio" showTime />
      <DateField source="end" label="Fin" showTime />
      <DateField source="updated" label="Actualización" showTime />
      <BooleanField source="arrived" label="Llegada" />
      <BooleanField source="safe" label="Seguro" />
    </Datagrid>
  </List>
)

const WalkTitle = ({ record }) => (
  <span>Recorrido {record ? `"${record.name}"` : ""}</span>
)

const WalkEdit = (props) => (
  <Edit title={<WalkTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <ReferenceInput label="Usuario" source="user" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <DateTimeInput source="start" label="Inicio" />
      <DateTimeInput source="end" label="Fin" />
      <DateTimeInput source="updated" label="Actualización" />
      <BooleanInput source="arrived" label="Llegada" />
      <BooleanInput source="safe" label="Seguro" />
    </SimpleForm>
  </Edit>
)

const walkResource = {
  icon: WalkIcon,
  list: WalkList,
  edit: WalkEdit,
}

export default walkResource
