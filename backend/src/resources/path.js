import React from "react"
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  Edit,
  SimpleForm,
  TextInput,
  Create,
} from "react-admin"
import PathIcon from "@material-ui/icons/Directions"

const PathList = (props) => (
  <List {...props}>
    <Datagrid>
      <ReferenceField source="from" reference="nodes">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField source="to" reference="nodes">
        <TextField source="id" />
      </ReferenceField>
    </Datagrid>
  </List>
)

const PathTitle = () => <span>Path</span>

const PathEdit = (props) => (
  <Edit title={<PathTitle />} {...props}>
    <SimpleForm redirect="list">
      <TextInput disabled source="id" className="hidden" />
      <ReferenceInput source="from" reference="nodes">
        <SelectInput optionText="id" />
      </ReferenceInput>
      <ReferenceInput source="to" reference="nodes">
        <SelectInput optionText="id" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
)

const PathCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect="list">
      <ReferenceInput source="from" reference="nodes">
        <SelectInput optionText="id" />
      </ReferenceInput>
      <ReferenceInput source="to" reference="nodes">
        <SelectInput optionText="id" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
)

const pathResource = {
  icon: PathIcon,
  list: PathList,
  edit: PathEdit,
  create: PathCreate,
}

export default pathResource
