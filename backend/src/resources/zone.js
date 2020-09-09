import React from "react"
import {
  List,
  Datagrid,
  NumberField,
  NumberInput,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  required,
  minValue,
  maxValue,
  number,
} from "react-admin"
import ZoneIcon from "@material-ui/icons/Adjust"

const validations = {
  longitude: [required(), number()],
  latitude: [required(), number()],
  radius: [required(), number(), minValue(50), maxValue(200)],
}

const ZoneList = (props) => (
  <List title="Lista de Zonas" perPage={25} {...props}>
    <Datagrid rowClick="edit">
      <NumberField source="longitude" label="Longitud" />
      <NumberField source="latitude" label="Latitud" />
      <NumberField source="radius" label="Radio" />
    </Datagrid>
  </List>
)

const ZoneTitle = () => <span>Zona</span>

const ZoneEdit = (props) => (
  <Edit title={<ZoneTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
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
      <NumberInput
        source="radius"
        label="Radio"
        validate={validations.radius}
      />
    </SimpleForm>
  </Edit>
)

const ZoneCreate = (props) => (
  <Create title="Crear Zona" {...props}>
    <SimpleForm redirect="list">
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
      <NumberInput
        source="radius"
        label="Radio"
        validate={validations.radius}
      />
    </SimpleForm>
  </Create>
)

const zoneResource = {
  icon: ZoneIcon,
  list: ZoneList,
  edit: ZoneEdit,
  create: ZoneCreate,
}

export default zoneResource
