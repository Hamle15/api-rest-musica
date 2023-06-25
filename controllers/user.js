// Test accion
const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "Message sended from: controllers/user.js",
  });
};

const register = (req, res) => {
  // Take the data of the body

  // Check that it fits me well

  // Validate data

  // Control duplicate users

  // ENCRYPTION PASSWORD

  // Create user Object

  // Save in the data base

  // Clean the obj to return

  // Return result

  return res.status(200).send({
    status: "succes",
    message: "Register path",
  });
};

// Export accions
module.exports = {
  prueba,
  register,
};
