const jwt = require("jwt-simple");
const { secret } = require("../helpers/jwt");

exports.authRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
      const payload = jwt.decode(token, secret);
      if (!allowedRoles.includes(payload.role)) {
        return res.status(403).send({
          status: "error",
          message: "Access denied. You don't have the required role.",
        });
      }
      next();
    } catch (error) {
      return res.status(401).send({
        status: "error",
        message: "Invalid token.",
      });
    }
  };
};
