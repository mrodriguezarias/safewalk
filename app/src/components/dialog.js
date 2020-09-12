import React, { forwardRef, useImperativeHandle, useState } from "react"
import { StyleSheet } from "react-native"
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
      cancel,
      accept,
      content,
      actions,
      contentStyle,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)

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

    const handleAccept = async (action) => {
      if (action) {
        setLoading(true)
        await action()
        setLoading(false)
      }
      handleHide()
    }

    content = content ?? children
    content =
      typeof content === "string" ? <Paragraph>{content}</Paragraph> : content

    const renderCancel = () => {
      if (!cancel) {
        return null
      }
      const action = cancel?.action ?? handleHide
      const text = cancel?.text ?? "Cancelar"
      return <Button onPress={action}>{text}</Button>
    }

    const renderAccept = () => {
      if (!accept) {
        return null
      }
      const action = accept?.action
      const text = accept?.text ?? "Aceptar"
      return (
        <Button
          loading={loading}
          disabled={loading}
          onPress={() => handleAccept(action)}
        >
          {text}
        </Button>
      )
    }

    return (
      <Portal>
        <RNDialog visible={visible} onDismiss={handleHide} {...props}>
          {title && <RNDialog.Title>{title}</RNDialog.Title>}
          {content && (
            <RNDialog.Content style={contentStyle}>{content}</RNDialog.Content>
          )}
          <RNDialog.Actions style={styles.actions}>
            {renderAccept()}
            {actions}
            {renderCancel()}
          </RNDialog.Actions>
        </RNDialog>
      </Portal>
    )
  },
)

const styles = StyleSheet.create({
  actions: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
  },
})

export default Dialog
