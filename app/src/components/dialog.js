import React, { forwardRef, useImperativeHandle, useState } from "react"
import {
  Dialog as RNDialog,
  Portal,
  Button,
  Paragraph,
} from "react-native-paper"

const Dialog = forwardRef(
  (
    {
      children,
      onDismiss,
      title,
      accept,
      content,
      actions,
      contentStyle,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false)

    useImperativeHandle(ref, () => ({
      show: handleShow,
      hide: handleHide,
    }))

    const handleShow = () => {
      setVisible(true)
    }

    const handleHide = () => {
      setVisible(false)
      if (onDismiss) {
        onDismiss()
      }
    }

    content = content ?? children
    content =
      typeof content === "string" ? <Paragraph>{content}</Paragraph> : content

    return (
      <Portal>
        <RNDialog visible={visible} onDismiss={handleHide} {...props}>
          {title && <RNDialog.Title>{title}</RNDialog.Title>}
          {content && (
            <RNDialog.Content style={contentStyle}>{content}</RNDialog.Content>
          )}
          {accept && (
            <RNDialog.Actions>
              <Button onPress={handleHide}>Aceptar</Button>
            </RNDialog.Actions>
          )}
          {actions && <RNDialog.Actions>{actions}</RNDialog.Actions>}
        </RNDialog>
      </Portal>
    )
  },
)

export default Dialog
