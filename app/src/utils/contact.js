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
  switchRelation: (relation) => {
    const relations = {
      carer: "cared",
      cared: "carer",
    }
    return relations[relation]
  },
  translateRelation: (relation, plural = false) => {
    return relations[relation][plural ? "plural" : "singular"]
  },
}

export default contactUtils
