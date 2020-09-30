import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react"
import { StyleSheet } from "react-native"
import {
  Dialog as RNDialog,
  Portal,
  Button,
  Paragraph,
} from "react-native-paper"
import _ from "lodash"

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
      visible: parentVisible,
      dismissable = true,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [params, setParams] = useState({})

    useEffect(() => {
      setVisible(parentVisible)
    }, [parentVisible])

    useImperativeHandle(ref, () => ({
      show: handleShow,
      hide: handleHide,
    }))

    const handleShow = (params) => {
      setParams(params)
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
        await action(params)
        setLoading(false)
      }
      handleHide()
    }

    const getTitle = () => {
      if (_.isFunction(title)) {
        return title(params)
      }
      return title
    }

    const getContent = () => {
      let cont = content ?? children
      if (_.isFunction(cont)) {
        cont = cont(params)
      }
      if (_.isString(cont)) {
        cont = <Paragraph>{cont}</Paragraph>
      }
      return cont
    }

    title = getTitle()
    content = getContent()

    const renderCancel = () => {
      if (!cancel) {
        return null
      }
      if (_.isFunction(cancel)) {
        cancel = cancel(params)
      }
      const action = cancel?.action ?? handleHide
      const text = cancel?.text ?? "Cancelar"
      return <Button onPress={action}>{text}</Button>
    }

    const renderAccept = () => {
      if (!accept) {
        return null
      }
      if (_.isFunction(accept)) {
        accept = accept(params)
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
        <RNDialog
          visible={visible}
          onDismiss={handleHide}
          dismissable={!loading && dismissable}
          {...props}
        >
          {title && <RNDialog.Title>{title}</RNDialog.Title>}
          {content && (
            <RNDialog.Content style={{ ...styles.content, ...contentStyle }}>
              {content}
            </RNDialog.Content>
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
  content: {
    marginBottom: -15,
  },
})

export default Dialog
