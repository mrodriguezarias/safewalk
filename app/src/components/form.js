import React from "react"
import { Form as RFForm } from "react-final-form"

const Form = ({ children, ...props }) => (
  <RFForm onSubmit={() => {}} {...props}>
    {children}
  </RFForm>
)

export default Form
