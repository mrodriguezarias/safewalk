import HttpStatus from "http-status-codes"
import contactService from "../services/contact"
import reqUtils from "../utils/req"

const contactController = {
  getContacts: async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query
      const { contacts, contentRangeHeader } = await contactService.getContacts(
        {
          filter,
          range,
          sort,
        },
      )
      res.header("Content-Range", contentRangeHeader)
      res.status(HttpStatus.OK).json(contacts)
    } catch (error) {
      next(error)
    }
  },
  getContactById: async (req, res, next) => {
    const id = req.params.id
    try {
      const user = await contactService.getContactById(id)
      res.status(HttpStatus.OK).json(user)
    } catch (error) {
      next(error)
    }
  },
  createContact: async (req, res, next) => {
    const data = req.body
    try {
      const response = await contactService.createContact(data)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updateContact: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const response = await contactService.updateContact(id, data)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deleteContact: async (req, res, next) => {
    const id = req.params.id
    try {
      const response = await contactService.deleteContact(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  getPendingRequests: async (req, res, next) => {
    const { userId } = req.query
    try {
      const response = await contactService.getPendingRequests(userId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  respond: async (req, res, next) => {
    const id = req.params.id
    const { confirmed } = req.body
    try {
      const response = await contactService.respond(id, confirmed)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  getContactsForUser: async (req, res, next) => {
    const { userId, relation } = req.query
    try {
      const response = await contactService.getContactsForUser(userId, relation)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  removeContact: async (req, res, next) => {
    const { source, target, relation } = req.query
    try {
      const response = await contactService.removeContact(
        source,
        target,
        relation,
      )
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  alertContacts: async (req, res, next) => {
    const userId = reqUtils.getLoggedUserId(req)
    try {
      await contactService.alertContacts(userId)
      res.status(HttpStatus.OK).json()
    } catch (error) {
      next(error)
    }
  },
  getCaredWalks: async (req, res, next) => {
    const { userId: caredId, page } = req.query
    const loggedId = reqUtils.getLoggedUserId(req)
    try {
      const response = await contactService.getCaredWalks(
        loggedId,
        caredId,
        page,
      )
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default contactController
