// Import dependencies
const express = require("express");
const check = require("../middlewares/auth");
const { authRole } = require("../middlewares/authRole");

// Configuaracion of upload
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/albums/");
  },
  filename: (req, file, cb) => {
    cb(null, "album-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });
// Carge router
const router = express.Router();

// Import controller
const AlbumController = require("../controllers/album");

// Define routes
router.get("/test-album", AlbumController.prueba);
router.post(
  "/save",
  check.auth,
  authRole(["role_admin"]),
  AlbumController.save
);
router.get(
  "/one/:id",
  check.auth,
  authRole(["role_admin"]),
  AlbumController.one
);
router.get(
  "/list/:artistId",
  check.auth,
  authRole(["role_admin"]),
  AlbumController.list
);

router.put(
  "/update/:id",
  check.auth,
  authRole(["role_admin"]),
  AlbumController.update
);

router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")], // This is goin to be the name of the field of the img
  AlbumController.upload
);
router.get("/image/:file", AlbumController.image);

router.delete(
  "/remove/:id",
  check.auth,
  authRole(["role_admin"]),
  AlbumController.remove
);

// Export routes
module.exports = router;
