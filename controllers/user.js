// Imports
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const validate = require("../helpers/validate");

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

// Export accions
module.exports = {
  prueba,
  register,
};
