import { Toast } from "native-base"

const uiUtils = {
  showToast: (settings) =>
    Toast.show({
      buttonText: "OK",
      duration: 3000,
      style: { marginBottom: 20 },
      ...settings,
    }),
  showError: (text) => uiUtils.showToast({ text, type: "danger" }),
}

export default uiUtils
