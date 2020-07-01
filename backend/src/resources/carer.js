import React from "react"
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  ReferenceField,
  ReferenceInput,
  AutocompleteInput,
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

const validations = {
  name: [required(), minLength(4), maxLength(16)],
  phone: [
    minLength(10),
    maxLength(20),
    regex(/^\+?\d+$/, "Must be a valid phone number"),
  ],
  password: [minLength(8), maxLength(32)],
}

const CarerList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <ReferenceField label="Carer" source="user" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="cared" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <BooleanField source="confirmed" />
    </Datagrid>
  </List>
)

const CarerTitle = () => <span>Carer</span>

const CarerEdit = (props) => (
  <Edit title={<CarerTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <ReferenceInput label="Carer" source="user" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <ReferenceInput source="cared" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <BooleanInput source="confirmed" />
    </SimpleForm>
  </Edit>
)

const CarerCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect="list">
      <ReferenceInput label="Carer" source="user" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <ReferenceInput source="cared" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <BooleanInput source="confirmed" />
    </SimpleForm>
  </Create>
)

const carerResource = {
  list: CarerList,
  edit: CarerEdit,
  create: CarerCreate,
}

export default carerResource
