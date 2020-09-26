import HttpStatus from "http-status-codes"
import contactModel from "../models/contact"
import HttpError from "../../../shared/errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

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
      carer: data.carer,
      cared: data.cared,
    })
    if (contact) {
      throw new HttpError(HttpStatus.CONFLICT, "Contact already exists")
    }
    const newContact = await contactModel.create(data)
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
}

export default contactService
