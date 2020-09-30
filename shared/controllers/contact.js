import contactService from "../services/contact"

const contactController = {
  sendRequest: async ({ from, to, relation }) => {
    const contactData = {
      source: from.id,
      target: to.id,
      relation,
    }
    await contactService.create(contactData)
  },
  getPendingRequests: async (userId) => {
    return await contactService.getPendingRequests(userId)
  },
  respond: async (id, confirmed) => {
    return await contactService.respond(id, confirmed)
  },
  getContactsForUser: async (userId, relation) => {
    return await contactService.getContactsForUser(userId, relation)
  },
  removeContact: async (source, target, relation) => {
    return await contactService.removeContact(source, target, relation)
  },
}

export default contactController
