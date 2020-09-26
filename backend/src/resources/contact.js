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
import ContactIcon from "@material-ui/icons/Contacts"

const ContactList = (props) => (
  <List title="Lista de Contactos" perPage={25} {...props}>
    <Datagrid rowClick="edit">
      <ReferenceField label="Cuidador" source="carer" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField label="Cuidado" source="cared" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField label="Creador" source="creator" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <BooleanField label="Confirmado" source="confirmed" />
    </Datagrid>
  </List>
)

const ContactTitle = () => <span>Contacto</span>

const ContactEdit = (props) => (
  <Edit title={<ContactTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <ReferenceInput label="Cuidador" source="carer" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <ReferenceInput label="Cuidado" source="cared" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <ReferenceInput label="Creador" source="creator" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <BooleanInput label="Confirmado" source="confirmed" />
    </SimpleForm>
  </Edit>
)

const ContactCreate = (props) => (
  <Create title="Crear Contacto" {...props}>
    <SimpleForm redirect="list">
      <ReferenceInput label="Cuidador" source="carer" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <ReferenceInput label="Cuidado" source="cared" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <ReferenceInput label="Creador" source="creator" reference="users">
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <BooleanInput label="Confirmado" source="confirmed" />
    </SimpleForm>
  </Create>
)

const contactResource = {
  icon: ContactIcon,
  list: ContactList,
  edit: ContactEdit,
  create: ContactCreate,
}

export default contactResource
