// Imports
const Album = require("../models/Album");
const Song = require("../models/Song");
const fs = require("fs");
const path = require("path");
// Test accion
const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "Message sended from: controllers/song.js",
  });
};

const save = (req, res) => {
  // Take the data from the body
  const params = req.body;

  Album.findById({ _id: params.album }).then((albumStored) => {
    console.log(albumStored, "ALBUMMMMstored");
    if (!albumStored) {
      return res.status(404).send({
        status: "error",
        message: "The album does not exist",
      });
    }

    Song.findOne({ album: params.album })
      .sort({ track: -1 }) // Ordenar en orden descendente por el campo 'track'
      .then((latestSong) => {
        let track = 1; // Valor predeterminado del campo 'track'

        if (latestSong) {
          track = latestSong.track + 1; // Incrementar el número de pista basado en la última canción registrada en el álbum
        }

        // Crear un objeto a partir del modelo
        let song = new Song({
          album: params.album,
          track: track,
          name: params.name,
          duration: params.duration,
        });

        // Guardar la canción
        song
          .save()
          .then((songStored) => {
            if (!songStored) {
              return res.status(500).send({
                status: "error",
                message: "Internal error while saving the song",
              });
            }
            return res.status(200).send({
              status: "success",
              song: songStored,
            });
          })
          .catch((error) => {
            return res.status(500).send({
              status: "error",
              message: "Internal error while saving the song",
              error: error.message,
            });
          });
      })
      .catch((error) => {
        return res.status(500).send({
          status: "error",
          message: "Internal error while retrieving the latest song",
          error: error.message,
        });
      });
  });
};

const one = (req, res) => {
  let songId = req.params.id;

  Song.findById(songId)
    .populate({
      path: "album",
      select: "-__v",
      // populate: { path: "artist", select: "-__v" }, // If you what the artist complete
    })
    .then((song) => {
      if (!song) {
        return res.status(404).send({
          status: "error",
          message: "The song does not exist",
        });
      }
      return res.status(200).send({
        status: "success",
        song,
        xd: song.album.artist,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The song does not exist",
        error: error.message,
      });
    });
};

const list = (req, res) => {
  // Take the id from the album
  const albumId = req.params.id;

  // Find
  Song.find({ album: albumId })
    .select("-__v")
    .populate({
      path: "album",
      select: "-__v",
      populate: { path: "artist", select: "-__v", model: "Artist" },
    })
    .sort("track")
    .then((songs) => {
      if (!songs) {
        return res.status(404).send({
          status: "error",
          message: "The album do not exist",
        });
      }

      // MODIFY HOW TO SEEN THE DATA

      // const songsArray = songs.map((song) => {
      //   return {
      //     _id: song._id,
      //     track: song.track,
      //     name: song.name,
      //     duration: song.duration,
      //     file: song.file,
      //     created_at: song.created_at,
      //     __v: song.__v,
      //     album: {
      //       _id: song.album._id,
      //       type: song.album.type,
      //       title: song.album.title,
      //       description: song.album.description,
      //       year: song.album.year,
      //       image: song.album.image,
      //       created_at: song.album.created_at,
      //       artist: {
      //         _id: song.album.artist._id,
      //         name: song.album.artist.name,
      //         description: song.album.artist.description,
      //         image: song.album.artist.image,
      //         created_at: song.album.artist.created_at,
      //         __v: song.album.artist.__v,
      //       },
      //     },
      //   };
      // });

      // Return result
      return res.status(200).send({
        status: "succes",
        // songsArray,
        songs,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The album do not exist",
      });
    });
};

const update = (req, res) => {
  // Take params from the url of the songs
  const songId = req.params.id;
  // Take data to save
  let data = req.body;
  // Find and update
  Song.findByIdAndUpdate(songId, data, { new: true })
    .then((songUpdate) => {
      if (!songUpdate) {
        return res.status(404).send({
          status: "error",
          message: "The song do not exist",
        });
      }
      return res.status(200).send({
        status: "succes",
        songUpdate,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The song do not exist",
      });
    });
};

const remove = (req, res) => {
  // Take id from the url
  const songId = req.params.id;

  Song.findByIdAndRemove(songId)
    .then((songRemoved) => {
      if (!songRemoved) {
        return res.status(404).send({
          status: "error",
          message: "The song do not exist",
        });
      }
      return res.status(200).send({
        status: "succes",
        song: songRemoved,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The song do not exist",
      });
    });
};

const upload = (req, res) => {
  // Take artits id
  let songId = req.params.id;
  // Take the img and check if exist
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "The peticion do not include the audio",
    });
  }

  // Take the name of the archive
  let song = req.file.originalname;

  const extension = path.extname(song).toLowerCase();

  // Check the extension
  if (extension != ".mp3" && extension != ".ogg") {
    // Delete Image
    const filePath = req.file.path;
    const fileDelete = fs.unlinkSync(filePath);

    // Return res negative
    return res.status(406).send({
      status: "error",
      message: "The extension of the song is not valid",
    });
  }
  // Save the img in bd
  Song.findByIdAndUpdate(
    { _id: songId },
    { file: req.file.filename },
    { new: true }
  )
    .then((songUpdate) => {
      if (!songUpdate) {
        return res.status(404).send({
          status: "error",
          message: "The id song do not exist",
        });
      }
      return res.status(200).send({
        status: "succes",
        album: songUpdate,
        file: req.file,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The id song do not exist",
        error: error.message,
      });
    });
};

const audio = (req, res) => {
  // Take params url
  const file = req.params.file;

  // Mont the path
  const filePath = "./uploads/songs/" + file;

  // Check if the img exist
  fs.stat(filePath, (error, exist) => {
    if (file == "default.mp3") {
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

// Export accions
module.exports = {
  prueba,
  save,
  one,
  list,
  update,
  remove,
  upload,
  audio,
};
