import HttpStatus from "http-status-codes"
import contactModel from "../models/contact"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"
import pushUtils, { pushTypes } from "../utils/push"
import userService from "./user"
import walkService from "./walk"
import contactUtils from "../../../app/src/utils/contact"
import userModel from "../models/user"

const contactService = {
  model: "contact",
  getContacts: async ({ filter = {}, range, sort } = {}) => {
    filter = dbUtils.transformQueryFilter(filter)
    const query = contactModel.find(filter)
    const count = await contactModel.count({})
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
      relation: data.relation,
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
      pushUtils.sendNotification({
        type: pushTypes.invite,
        to: data.target,
        message: `${
          sourceUser.name
        } te envió una solicitud para ser su contacto ${contactUtils.translateRelation(
          data.relation,
        )}`,
      })
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
    const contact = await contactModel.findByIdAndRemove(id)
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
    const contact = await contactModel.findOneAndRemove({
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
  alertContacts: async (userId) => {
    const user = await userService.getUserById(userId)
    const walk = await walkService.getWalkInProgress(userId)
    pushUtils.sendNotificationToCarers({
      type: pushTypes.alert,
      userId,
      message: `${user.name} acaba de reportar un incidente de seguridad`,
      payload: { walkId: walk.id, contactId: userId },
    })
  },
  getCaredWalks: async (loggedId, caredId, page) => {
    const cared = await contactService.getContactsForUser(loggedId, "cared")
    if (!caredId || !cared.map(({ id }) => id).includes(caredId)) {
      throw new HttpError(HttpStatus.FORBIDDEN, "Unauthorized")
    }
    const walks = await walkService.getWalksForUser(caredId, { page })
    return walks
  },
  getOwnWalks: async (loggedId, page) => {
    const walks = await walkService.getWalksForUser(loggedId, {
      page,
      filters: { end: { $ne: null } },
    })
    return walks
  },
  getContactUser: async (userId, loggedId) => {
    const logged = await userModel.findById(loggedId)
    const isAdmin = logged?.admin
    const isSelf = userId === loggedId
    let isCared = false
    if (!isAdmin || !isSelf) {
      const cared = await contactService.getContactsForUser(loggedId, "cared")
      isCared = cared.map(({ id }) => id).includes(userId)
    }
    if (!isAdmin && !isSelf && !isCared) {
      throw new HttpError(HttpStatus.FORBIDDEN, "Unauthorized")
    }
    return await userService.getUserById(userId)
  },
}

export default contactService
