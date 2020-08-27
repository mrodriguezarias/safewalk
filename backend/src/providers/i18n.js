import polyglotI18nProvider from "ra-i18n-polyglot"
import spanishMessages from "@blackbox-vision/ra-language-spanish"

const i18nProvider = () => {
  const i18nProvider = polyglotI18nProvider(() => spanishMessages, "es")
  return i18nProvider
}

export default i18nProvider
