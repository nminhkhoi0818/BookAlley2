const hasRoles = (...roles) => (req, res, next) => {
  if (roles.includes(req?.user?.role)) return next();
  return res.sendStatus(401);
};

module.exports = hasRoles;
