// Test accion
const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "Message sended from: controllers/album.js",
  });
};

// Export accions
module.exports = {
  prueba,
};
