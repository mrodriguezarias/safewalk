import React from "react"
import { List, Divider } from "react-native-paper"

const ListSection = ({ title, children }) => (
  <List.Section>
    <List.Subheader>{title}</List.Subheader>
    {children && <Divider />}
    {children}
  </List.Section>
)

export default ListSection
