// Import dependencies
const express = require("express");

// Carge router
const router = express.Router();

// Import controller
const SongController = require("../controllers/song");

// Define routes
router.get("/test-song", SongController.prueba);

// Export routes
module.exports = router;
