// Import dependencies
const express = require("express");
const check = require("../middlewares/auth");
const { authRole } = require("../middlewares/authRole");

// Configuaracion of upload
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/songs/");
  },
  filename: (req, file, cb) => {
    cb(null, "song-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

// Carge router
const router = express.Router();

// Import controller
const SongController = require("../controllers/song");

// Define routes
router.get("/test-song", SongController.prueba);
router.post("/save", check.auth, authRole(["role_admin"]), SongController.save);
router.get(
  "/one/:id",
  check.auth,
  authRole(["role_admin"]),
  SongController.one
);
router.get(
  "/list/:id",
  check.auth,
  authRole(["role_admin"]),
  SongController.list
);
router.put(
  "/update/:id",
  check.auth,
  authRole(["role_admin"]),
  SongController.update
);
router.delete(
  "/remove/:id",
  check.auth,
  authRole(["role_admin"]),
  SongController.remove
);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")], // This is goin to be the name of the field of the img
  SongController.upload
);
router.get("/audio/:file", check.auth, SongController.audio);

// Export routes
module.exports = router;
