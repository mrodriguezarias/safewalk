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
  number,
} from "react-admin"
import NodeIcon from "@material-ui/icons/PinDrop"

const validations = {
  longitude: [required(), number()],
  latitude: [required(), number()],
  weight: [number()],
}

const NodeList = (props) => (
  <List title="Lista de Nodos" perPage={25} {...props}>
    <Datagrid rowClick="edit">
      <NumberField source="longitude" label="Longitud" />
      <NumberField source="latitude" label="Latitud" />
      <NumberField source="weights.crime" label="Peso (crimen)" />
      <NumberField source="weights.places" label="Peso (lugares)" />
      <NumberField source="weights.zones" label="Peso (zonas)" />
    </Datagrid>
  </List>
)

const NodeTitle = () => <span>Nodo</span>

const NodeEdit = (props) => (
  <Edit title={<NodeTitle />} {...props}>
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
        source="weights.crime"
        label="Peso (crimen)"
        validate={validations.weight}
      />
      <NumberInput
        source="weights.places"
        label="Peso (lugares)"
        validate={validations.weight}
      />
      <NumberInput
        source="weights.zones"
        label="Peso (zonas)"
        validate={validations.weight}
      />
    </SimpleForm>
  </Edit>
)

const NodeCreate = (props) => (
  <Create title="Crear Nodo" {...props}>
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
        source="weights.crime"
        label="Peso (crimen)"
        validate={validations.weight}
      />
      <NumberInput
        source="weights.places"
        label="Peso (lugares)"
        validate={validations.weight}
      />
      <NumberInput
        source="weights.zones"
        label="Peso (zonas)"
        validate={validations.weight}
      />
    </SimpleForm>
  </Create>
)

const nodeResource = {
  icon: NodeIcon,
  list: NodeList,
  edit: NodeEdit,
  create: NodeCreate,
}

export default nodeResource
