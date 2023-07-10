// Imports
const Album = require("../models/Album");
const Artist = require("../models/Artist");
const Song = require("../models/Song");
const path = require("path");
const fs = require("fs");

// Helpers
const { updateAlbum } = require("../helpers/albumHelper");

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

  Artist.findById({ _id: params.artist })
    .then((artistFinded) => {
      if (!artistFinded) {
        return res.status(404).send({
          status: "error",
          message: "The user do not exist",
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
            error: error.message,
          });
        });
    })
    .catch((error) => {
      return req.status(404).send({
        status: "error",
        message: "The user do not exist",
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
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The artist do not exist",
      });
    });
};

const update = (req, res) => {
  // Take the params from the url
  const idAlbum = req.params.id;

  // Take data from the body
  const params = req.body;
  if (params.type) {
    if (params.type !== "Single" && params.type !== "Album") {
      return res.status(400).send({
        status: "error",
        message: "The field have to be a type Single or Album",
      });
    }
  }

  // Check if an artist ID is provided
  if (params.artist) {
    Artist.findById(params.artist)
      .then((artist) => {
        if (!artist) {
          return res.status(404).send({
            status: "error",
            message: "The artist does not exist",
          });
        }
        updateAlbum(idAlbum, params, res);
      })
      .catch((error) => {
        return res.status(500).send({
          status: "error",
          message: "Error finding the artist",
          error: error.message,
        });
      });
  } else {
    updateAlbum(idAlbum, params, res);
  }
};

const upload = (req, res) => {
  // Take artits id
  let albumId = req.params.id;
  // Take the img and check if exist
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "The peticion do not include the img",
    });
  }

  // Take the name of the archive
  let image = req.file.originalname;

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
  Album.findByIdAndUpdate(
    { _id: albumId },
    { image: req.file.filename },
    { new: true }
  )
    .then((albumUpdate) => {
      if (!albumUpdate) {
        return res.status(404).send({
          status: "error",
          message: "The album do not exist",
        });
      }
      return res.status(200).send({
        status: "succes",
        album: albumUpdate,
        file: req.file,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The album do not exist",
      });
    });
};

const image = (req, res) => {
  // Take params url
  const file = req.params.file;

  // Mont the path
  const filePath = "./uploads/albums/" + file;

  // Check if the img exist
  fs.stat(filePath, (error, exist) => {
    if (file == "default.png") {
      return res.status(200).send({
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

const remove = async (req, res) => {
  // Take album Id
  const albumId = req.params.id;

  // Consult to try to delete the album
  try {
    const albumFinded = await Album.findById(albumId);
    const albumRemoved = await Album.findById(albumId).deleteOne();

    if (!albumFinded) {
      return res.status(404).send({
        status: "error",
        message: "Album do not exist",
      });
    }

    const songsRemoved = await Song.find({ album: albumId }).deleteMany();

    return res.status(200).send({
      status: "success",
      message: "Artist removed",
      albumRemoved,
      songsRemoved,
    });
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Artist not found",
      error: error.message,
    });
  }
};

// Export accions
module.exports = {
  prueba,
  save,
  one,
  list,
  update,
  upload,
  image,
  remove,
};
