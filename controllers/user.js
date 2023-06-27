// Imports
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const validate = require("../helpers/validate");
const jwt = require("../helpers/jwt");

// Test accion
const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "Message sended from: controllers/user.js",
  });
};

const register = (req, res) => {
  // Take the data of the body
  let params = req.body;

  // Check that it fits me well
  const requiredFields = ["name", "nick", "email", "password"];
  const missingFields = [];

  requiredFields.forEach((field) => {
    if (!params[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return res.status(400).send({
      status: "error",
      message: `The following field(s) are missing: ${missingFields.join(
        ", "
      )}`,
    });
  }

  // Validate data
  try {
    validate(params);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Validate fail",
      error: error.message,
    });
  }

  // Control duplicate users
  User.find({
    $or: [{ email: params.email }, { nick: params.nick.toLowerCase() }],
  }).then(async (user) => {
    if (user && user.length >= 1) {
      return res.status(409).send({
        status: "error",
        message: "The User alredy exist",
      });
    }

    // ENCRYPTION PASSWORD
    let pdw = await bcrypt.hash(params.password, 10);
    params.password = pdw;

    // Create user Object
    let user_to_save = new User(params);

    // Save in the data base
    user_to_save
      .save()
      .then((userStored) => {
        if (!userStored) {
          return res.status(500).send({
            status: "error",
            message: "Error to save the User",
          });
        }

        // Clean the obj to return
        let userCreated = userStored.toObject();
        delete userCreated.password;
        delete userCreated.role;
        // Return result
        return res.status(200).json({
          status: "success",
          message: "User registered successfully",
          user: userCreated,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          status: "error",
          message: "Error to save the User",
        });
      });
  });
};

const login = (req, res) => {
  // Take the params of the peticion
  let params = req.body;

  const email = params.email.trim();
  const password = params.password.trim();

  // Check if the data get
  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      message: "Missing data",
    });
  }

  // Look email in the bd if the user exist
  User.findOne({ email: email })
    .select("+password +role -__v ")
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: "error",
          message: "Could not find the user",
        });
      }

      // Check the password
      const pdw = bcrypt.compareSync(password, user.password);

      if (!pdw) {
        return res.status(400).send({
          status: "error",
          message: "Mail o password Incorrect",
        });
      }

      let identityUser = user.toObject();
      delete identityUser.password;
      delete identityUser.role;

      // Get the token
      const token = jwt.createToken(user);

      // Return token and data user
      return res.status(200).send({
        status: "succes",
        message: "Login succes",
        user: identityUser,
        token,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "Could not find the user",
        error: error.message,
      });
    });
};

// Export accions
module.exports = {
  prueba,
  register,
  login,
};
