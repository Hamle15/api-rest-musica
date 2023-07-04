// Imports
const Album = require("../models/Album");

// Test accion
const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "Message sended from: controllers/album.js",
  });
};

const save = (req, res) => {
  // Take data from the body
  let params = req.body;

  // Validate Data

  if (params.type !== "Single" && params.type !== "Album") {
    return res.status(400).send({
      status: "error",
      message: "The field have to be a type Single or Album",
    });
  }

  // Create Obj
  let album = new Album(params);

  // Save the obj
  album
    .save()
    .then((albumStored) => {
      if (!albumStored) {
        return res.status(200).send({
          status: "succes",
          message: "path save album",
          album,
        });
      }
      return res.status(200).send({
        status: "succes",
        albumStored,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "Could not save the album",
      });
    });
};

const one = (req, res) => {
  // Take the id from the album
  const albumId = req.params.id;

  // Find album and take the artist info
  Album.findOne({ _id: albumId })
    .populate({ path: "artist", select: "-__v" })

    .then((albumSaved) => {
      if (!albumSaved) {
        return res.status(404).send({
          status: "error",
          message: "The album do not exist",
        });
      }
      // Return result
      return res.status(200).send({
        status: "succes",
        album: albumSaved,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The album do not exist",
      });
    });
};

const list = (req, res) => {
  // Get the id from the artist from the url
  const artistId = req.params.artistId;
  // Get all the albums from a artist
  Album.find({ artist: artistId })
    .populate("artist")
    .then((albums) => {
      if (!albums) {
        return res.status(404).send({
          status: "error",
          message: "The artist do not exist",
        });
      }
      // Return result
      return res.status(200).send({
        status: "succes",
        albums,
      });
    });
};

// Export accions
module.exports = {
  prueba,
  save,
  one,
  list,
};
