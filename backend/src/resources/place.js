import React from "react"
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  BooleanField,
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  BooleanInput,
  NumberInput,
  Create,
  required,
  number,
  minLength,
  maxLength,
} from "react-admin"
import PlaceIcon from "@material-ui/icons/Place"

const validations = {
  name: [required(), minLength(4), maxLength(16)],
  category: [required()],
  longitude: [required(), number()],
  latitude: [required(), number()],
}

const PlaceList = (props) => (
  <List
    perPage={25}
    sort={{ field: "name", order: "ASC" }}
    title="Lista de Lugares"
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="Nombre" />
      <ReferenceField
        label="Categoría"
        source="category"
        reference="categories"
      >
        <TextField source="name" />
      </ReferenceField>
      <BooleanField source="safe" label="Seguro" />
    </Datagrid>
  </List>
)

const PlaceTitle = ({ record }) => (
  <span>Lugar {record ? `"${record.name}"` : ""}</span>
)

const PlaceEdit = (props) => (
  <Edit title={<PlaceTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <TextInput source="name" label="Nombre" validate={validations.name} />
      <ReferenceInput
        label="Categoría"
        source="category"
        reference="categories"
        validate={validations.category}
      >
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <NumberInput
        source="longitude"
        label="Longitud"
        validate={validations.longitude}
      />
      <NumberInput
        source="latitude"
        label="Latitud"
        validate={validations.latitude}
      />
      <BooleanInput source="safe" label="Seguro" />
    </SimpleForm>
  </Edit>
)

const PlaceCreate = (props) => (
  <Create title="Crear Lugar" {...props}>
    <SimpleForm redirect="list">
      <TextInput source="name" label="Nombre" validate={validations.name} />
      <ReferenceInput
        label="Categoría"
        source="category"
        reference="categories"
        validate={validations.category}
      >
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <NumberInput
        source="longitude"
        label="Longitud"
        validate={validations.longitude}
      />
      <NumberInput
        source="latitude"
        label="Latitud"
        validate={validations.latitude}
      />
      <BooleanInput source="safe" label="Seguro" />
    </SimpleForm>
  </Create>
)

const placeResource = {
  icon: PlaceIcon,
  list: PlaceList,
  edit: PlaceEdit,
  create: PlaceCreate,
}

export default placeResource