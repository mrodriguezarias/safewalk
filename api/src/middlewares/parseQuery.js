const parseQueryMiddleware = (req, res, next) => {
  try {
    req.query = Object.keys(req.query).reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: JSON.parse(req.query[cur]),
      }),
      {},
    )
  } catch (error) {}
  next()
}

export default parseQueryMiddleware
