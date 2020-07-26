import React from "react"
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  ReferenceField,
  NumberField,
  NumberInput,
  Edit,
  SimpleForm,
  BooleanInput,
  TextInput,
  Create,
  required,
  number,
} from "react-admin"
import NodeIcon from "@material-ui/icons/PinDrop"

const validations = {
  longitude: [number()],
  password: [number()],
  weight: [number()],
}

const NodeList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <NumberField source="longitude" />
      <NumberField source="latitude" />
      <NumberField source="weight" />
    </Datagrid>
  </List>
)

const NodeTitle = () => <span>Node</span>

const NodeEdit = (props) => (
  <Edit title={<NodeTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <NumberInput source="longitude" validate={validations.longitude} />
      <NumberInput source="latitude" validate={validations.latitude} />
      <NumberInput source="weight" validate={validations.weight} />
    </SimpleForm>
  </Edit>
)

const NodeCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect="list">
      <NumberInput
        source="longitude"
        validate={[...validations.longitude, required()]}
      />
      <NumberInput
        source="latitude"
        validate={[...validations.latitude, required()]}
      />
      <NumberInput source="latitude" validate={validations.weight} />
      <BooleanInput source="confirmed" />
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
