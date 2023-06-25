// Import dependencies
const express = require("express");

// Carge router
const router = express.Router();

// Import controller
const AlbumController = require("../controllers/album");

// Define routes
router.get("/test-album", AlbumController.prueba);

// Export routes
module.exports = router;
