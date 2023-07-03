// Import dependencies
const express = require("express");
const check = require("../middlewares/auth");
const { authRole } = require("../middlewares/authRole");

// Configuaracion of upload
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/artists/");
  },
  filename: (req, file, cb) => {
    cb(null, "artists-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

// Carge router
const router = express.Router();

// Import controller
const ArtistController = require("../controllers/artist");

// Define routes
router.get("/test-artist", ArtistController.prueba);
router.post(
  "/save",
  check.auth,
  authRole(["role_admin"]),
  ArtistController.save
);
router.get("/one/:id", check.auth, ArtistController.one);
router.get("/list/:page?", check.auth, ArtistController.list);
router.put(
  "/update/:id",
  check.auth,
  authRole(["role_admin"]),
  ArtistController.update
);
router.delete(
  "/remove/:id",
  check.auth,
  authRole(["role_admin"]),
  ArtistController.remove
);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")], // This is goin to be the name of the field of the img
  ArtistController.upload
);
router.get("/image/:file", ArtistController.image);

// Export routes
module.exports = router;
