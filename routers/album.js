// Import dependencies
const express = require("express");
const check = require("../middlewares/auth");
const { authRole } = require("../middlewares/authRole");

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

// Export routes
module.exports = router;
