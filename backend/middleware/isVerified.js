const isVerified = (req, res, next) => {
  if (req?.user?.verified) return next();
  return res.sendStatus(401);
};

module.exports = isVerified;
