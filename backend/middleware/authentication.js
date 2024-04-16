const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer")) {
    const accessToken = authHeader.split(' ')[1]
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        req.user = {}
        return next()
      }
      const user = await User.findById(decoded.id).select("-password -refresh_token").exec()
      if (user) {
        req.user = user.toObject({getters: true})
      }
      else {
        req.user = {}
      }
      return next()
    });
  }
  else {
    req.user = {}
    return next()
  }
}

module.exports = authentication