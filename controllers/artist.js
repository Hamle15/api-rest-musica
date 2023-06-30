// Imports
const Artist = require("../models/Artist");
const mongoosePaguination = require("mongoose-pagination");
// Test accion
const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "Message sended from: controllers/artist.js",
  });
};

const save = (req, res) => {
  // Take the data of th body
  let params = req.body;

  if (!params.name) {
    return res.status(400).send({
      status: "error",
      message: "The name is require",
    });
  }

  // Check if duplicate Artist
  Artist.find({ name: params.name })
    .then((artistD) => {
      if (artistD && artistD.length >= 1) {
        return res.status(409).send({
          status: "error",
          message: "The artist alredy exist",
        });
      }
      // Crate the obj of the body
      let artist = new Artist(params);

      // Saved
      artist
        .save()
        .then((artistStored) => {
          if (!artistStored) {
            return res.status(500).send({
              status: "error",
              message: "The artist could not be saved",
            });
          }
          return res.status(200).send({
            status: "succes",
            artist: artistStored,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            status: "error",
            message: "The artist could not be saved",
          });
        });
    })
    .catch((error) => {
      return res.status(409).send({
        status: "error",
        message: "The artist alredy exist",
      });
    });
};

const one = (req, res) => {
  // Take the params from the url
  const artistId = req.params.id;
  // Find
  Artist.findById(artistId)
    .then((artist) => {
      if (!artist) {
        return res.status(404).send({
          status: "error",
          message: "The user do not exist",
        });
      }
      return res.status(200).send({
        status: "succes",
        artist: artist,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The user do not exist",
      });
    });
};

const list = async (req, res) => {
  // Take the page
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  page = parseInt(page);

  // How many elements will have de page
  const itemsPerPage = 5;

  try {
    const ArtistFind = await Artist.find()
      .select("-__v")
      .sort("name")
      .paginate(page, itemsPerPage);
    const total = await Artist.countDocuments({});
    if (!ArtistFind) {
      return res.status(404).send({
        status: "error",
        message: "There are no registered artists",
      });
    }

    return res.status(200).send({
      status: "succes",
      page,
      itemsPerPage,
      total,
      ArtistFind,
    });
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "There are no registered artists",
      error: error.message,
    });
  }
};

const update = (req, res) => {
  // Take the id from url
  const artistId = req.params.id;

  // Take data of body
  const data = req.body;

  // Look and update
  Artist.findByIdAndUpdate(artistId, data, { new: true })
    .then((artistUpdate) => {
      if (!artistUpdate) {
        return res.status(404).send({
          status: "succes",
          message: "The artist do not exist",
        });
      }
      return res.status(200).send({
        status: "succes",
        artistUpdate,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "succes",
        message: "The artist do not exist",
      });
    });
};

// Export accions
module.exports = {
  prueba,
  save,
  one,
  list,
  update,
};
