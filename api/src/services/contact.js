import HttpStatus from "http-status-codes"
import contactModel from "../models/contact"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"
import pushUtils from "../utils/push"
import userService from "./user"
import contactUtils from "../../../app/src/utils/contact"

const contactService = {
  model: "contact",
  getContacts: async ({ filter = {}, range, sort } = {}) => {
    filter = dbUtils.transformQueryFilter(filter)
    const query = contactModel.find(filter)
    const count = await contactModel.estimatedDocumentCount()
    const [paginated, contentRangeHeader] = dbUtils.paginate(
      query,
      range,
      count,
    )
    const sorted = await dbUtils.sort(paginated, sort)
    const contacts = _.map(sorted, (contact) => contact.toJSON())
    return { contacts, contentRangeHeader }
  },
  getContactById: async (id) => {
    const contact = await contactModel.findById(id)
    if (!contact) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Contact not found")
    }
    return contact
  },
  createContact: async (data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Contact not provided")
    }
    const contact = await contactModel.findOne({
      source: data.source,
      target: data.target,
    })
    if (contact) {
      const error = contact.confirmed
        ? "El contacto ya existe"
        : "Ya se le envió una solicitud a este contacto"
      throw new HttpError(HttpStatus.CONFLICT, error)
    }
    const newContact = await contactModel.create(data)
    if (!data.confirmed) {
      const sourceUser = await userService.getUserById(data.source)
      const targetUser = await userService.getUserById(data.target)
      pushUtils.sendNotification(
        targetUser.pushToken,
        `${
          sourceUser.name
        } te envió una solicitud para ser su contacto ${contactUtils.translateRelation(
          data.relation,
        )}`,
      )
    }
    return newContact
  },
  updateContact: async (id, data) => {
    const contact = await contactModel.findById(id)
    if (!contact) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Contact not found")
    }

    data = _.omit(data, "id")
    const updatedContact = await contactModel.findByIdAndUpdate(id, data, {
      new: true,
    })
    if (!updatedContact) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Contact not found")
    }
    return updatedContact
  },
  deleteContact: async (id) => {
    const contact = await contactModel.findByIdAndDelete(id)
    if (!contact) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Contact not found")
    }
    return contact
  },
  getPendingRequests: async (userId) => {
    let pending = await contactModel
      .find({
        confirmed: false,
        target: userId,
      })
      .populate("source")
      .sort({ created: -1 })
    pending = _.map(pending, (req) => {
      req = req.toJSON()
      const { id, relation, source } = req
      return {
        id,
        relation: contactUtils.switchRelation(relation),
        user: source,
      }
    })
    return pending
  },
  respond: async (id, confirmed) => {
    if (confirmed) {
      return contactService.updateContact(id, { confirmed })
    }
    return contactService.deleteContact(id)
  },
  getContactsForUser: async (userId, relation) => {
    let contacts = await contactModel
      .find({
        confirmed: true,
        $or: [
          {
            relation,
            source: userId,
          },
          {
            relation: contactUtils.switchRelation(relation),
            target: userId,
          },
        ],
      })
      .populate("source")
      .populate("target")
      .sort({ created: -1 })
    contacts = _.map(contacts, (req) => {
      req = req.toJSON()
      const rel = req.relation === relation ? "target" : "source"
      return req[rel]
    })
    return contacts
  },
  removeContact: async (source, target, relation) => {
    const contact = await contactModel.findOneAndDelete({
      confirmed: true,
      $or: [
        {
          relation,
          target,
          source,
        },
        {
          relation: contactUtils.switchRelation(relation),
          target: source,
          source: target,
        },
      ],
    })
    return contact
  },
}

export default contactService
