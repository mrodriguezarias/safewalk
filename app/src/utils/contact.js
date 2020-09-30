const relations = {
  carer: {
    singular: "Cuidador",
    plural: "Cuidadores",
  },
  cared: {
    singular: "Cuidado",
    plural: "Cuidados",
  },
}

const contactUtils = {
  translateRelation: (relation, plural = false) => {
    return relations[relation][plural ? "plural" : "singular"]
  },
}

export default contactUtils
