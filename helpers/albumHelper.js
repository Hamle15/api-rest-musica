// albumHelper.js
const Album = require("../models/Album");

const updateAlbum = (idAlbum, params, res) => {
  return Album.findByIdAndUpdate(idAlbum, params, { new: true })
    .select("-__v")
    .then((albumUpdate) => {
      if (!albumUpdate) {
        return res.status(404).send({
          status: "error",
          message: "The album does not exist",
        });
      }
      return res.status(200).send({
        status: "success",
        albumUpdate,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "Error updating the album",
        error: error.message,
      });
    });
};

module.exports = {
  updateAlbum,
};
