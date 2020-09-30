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
  SelectInput,
  Create,
  required,
  choices,
} from "react-admin"
import ContactIcon from "@material-ui/icons/Contacts"

const validations = {
  source: [required()],
  target: [required()],
  relation: [required(), choices(["carer", "cared"])],
}

const relations = [
  { id: "carer", name: "Cuidador" },
  { id: "cared", name: "Cuidado" },
]

const RelationField = ({ label, source, record }) => {
  const relation = relations.find(({ id }) => id === record[source]).name
  const newRecord = {
    ...record,
    [source]: relation,
  }
  return <TextField label={label} source={source} record={newRecord} />
}

const ContactList = (props) => (
  <List title="Lista de Contactos" perPage={25} {...props}>
    <Datagrid rowClick="edit">
      <ReferenceField label="Origen" source="source" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField label="Destino" source="target" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <RelationField label="Relación" source="relation" />
      <BooleanField label="Confirmado" source="confirmed" />
    </Datagrid>
  </List>
)

const ContactTitle = () => <span>Contacto</span>

const ContactEdit = (props) => (
  <Edit title={<ContactTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <ReferenceInput
        label="Origen"
        source="source"
        reference="users"
        validate={validations.source}
      >
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <ReferenceInput
        label="Destino"
        source="target"
        reference="users"
        validate={validations.target}
      >
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <SelectInput
        label="Relación"
        source="relation"
        choices={relations}
        validate={validations.relation}
      />
      <BooleanInput label="Confirmado" source="confirmed" />
    </SimpleForm>
  </Edit>
)

const ContactCreate = (props) => (
  <Create title="Crear Contacto" {...props}>
    <SimpleForm redirect="list">
      <ReferenceInput
        label="Origen"
        source="source"
        reference="users"
        validate={validations.source}
      >
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <ReferenceInput
        label="Destino"
        source="target"
        reference="users"
        validate={validations.target}
      >
        <AutocompleteInput source="name" />
      </ReferenceInput>
      <SelectInput
        label="Relación"
        source="relation"
        choices={relations}
        validate={validations.relation}
      />
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
