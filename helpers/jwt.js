// Import dependecies
const jwt = require("jwt-simple");
const moment = require("moment");

// Password secret
const secret = "EL_BIYO_ES_MUY_MALO_MESSI_ES_MEJOR_SUUPAPI";

// Funcion for generate tokens
const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    created_at: user.created_at,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix(),
  };

  return jwt.encode(payload, secret);
};

// Exports modules
module.exports = {
  secret,
  createToken,
};
