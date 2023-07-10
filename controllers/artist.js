// Imports
const Artist = require("../models/Artist");
const mongoosePaguination = require("mongoose-pagination");
const path = require("path");
const fs = require("fs");
const Album = require("../models/Album");
const Song = require("../models/Song");

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
  Artist.findById({ _id: artistId })
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

const remove = async (req, res) => {
  const artistId = req.params.id;
  try {
    const artistRemoved = await Artist.findByIdAndDelete(artistId);
    if (!artistRemoved) {
      return res.status(404).send({
        status: "error",
        message: "Artist not found",
      });
    }

    const albums = await Album.find({ artist: artistId });

    const deleteAlbumsPromises = albums.map(async (album) => {
      await Song.deleteMany({ album: album._id });
      await album.deleteOne();
    });

    await Promise.all(deleteAlbumsPromises);

    return res.status(200).send({
      status: "success",
      message: "Artist removed",
      artistRemoved,
    });
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Artist not found",
      error: error.message,
    });
  }
};

const upload = (req, res) => {
  // Take artits id
  let artistId = req.params.id;
  // Take the img and check if exist
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "The peticion do not include the img",
    });
  }

  // Take the name of the archive
  let image = req.file.originalname;

  // Take the info of the img
  const imageSplit = image.split(".");

  const extension = path.extname(image).toLowerCase();

  // Check the extension
  if (
    extension != ".png" &&
    extension != ".jpg" &&
    extension != ".jpeg" &&
    extension != ".gif"
  ) {
    // Delete Image
    const filePath = req.file.path;
    const fileDelete = fs.unlinkSync(filePath);

    // Return res negative
    return res.status(406).send({
      status: "error",
      message: "The extension of the img is not valid",
    });
  }
  // Save the img in bd
  Artist.findByIdAndUpdate(
    { _id: artistId },
    { image: req.file.filename },
    { new: true }
  )
    .then((artistUpdate) => {
      if (!artistUpdate) {
        return res.status(500).send({
          status: "error",
          message: "error in the upload",
        });
      }
      return res.status(200).send({
        status: "succes",
        artist: artistUpdate,
        file: req.file,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "error in the upload",
      });
    });
};

const image = (req, res) => {
  // Take params url
  const file = req.params.file;

  // Mont the path
  const filePath = "./uploads/artists/" + file;

  // Check if the img exist
  fs.stat(filePath, (error, exist) => {
    if (file == "default.png") {
      return res.status(404).send({
        status: "error",
        message: "Is the default img",
      });
    }
    if (!exist || error) {
      return res.status(404).send({
        status: "error",
        message: "the img do not exist",
      });
    }
    // Return file
    return res.sendFile(path.resolve(filePath));
  });
};

// Export accions
module.exports = {
  prueba,
  save,
  one,
  list,
  update,
  remove,
  upload,
  image,
};
