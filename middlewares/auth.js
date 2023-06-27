// Import modules
const jwt = require("jwt-simple");
const moment = require("moment");

// Import secret password
const { secret } = require("../helpers/jwt");

// Create middleware
exports.auth = (req, res, next) => {
  // Check the header of auth
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "The peticion do not have the header of autentificacion",
    });
  }
  // Clean token
  let token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    let payload = jwt.decode(token, secret);
    console.log(payload, "holaaaa");
    // Check the expiration
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: "error",
        message: "Token Invalid",
      });
    }
    req.user = payload;
  } catch (error) {
    return res.status(404).send({
      status: "error",
      menssage: "Token Invalid",
      error,
    });
  }
  // Add data user to the request
  next();
  // Eject
};
