import contactService from "../services/contact"

const contactController = {
  sendRequest: async ({ from, to, relation }) => {
    const [carer, cared] = (() => {
      switch (relation) {
        case "carer":
          return [to.id, from.id]
        case "cared":
          return [from.id, to.id]
        default:
          throw new Error("Unknown relation")
      }
    })()
    const contactData = {
      carer,
      cared,
      creator: from.id,
    }
    await contactService.create(contactData)
  },
}

export default contactController
