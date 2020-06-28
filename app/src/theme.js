const colors = {
  green: {
    light: "#03CEA4",
    dark: "#027961",
  },
  blue: {
    light: "#1A8FE3",
    dark: "#1573B7",
  },
  purple: {
    light: "#B5A2CD",
    dark: "#7D5BA6",
  },
}

const theme = {
  header: colors.green,
  primary: colors.blue,
  accent: colors.blue,
  tabBar: colors.purple,
}

const getTheme = (appearance) => {
  return Object.keys(theme).reduce((accum, key) => {
    const value = theme[key][appearance]
    return { ...accum, [key]: value }
  }, {})
}

export default getTheme
