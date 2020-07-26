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
  Create,
} from "react-admin"
import ContactsIcon from "@material-ui/icons/Contacts"

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
  icon: ContactsIcon,
  list: CarerList,
  edit: CarerEdit,
  create: CarerCreate,
}

export default carerResource
