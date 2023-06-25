// Import dependencies
const express = require("express");

// Carge router
const router = express.Router();

// Import controller
const ArtisrController = require("../controllers/artist");

// Define routes
router.get("/test-artist", ArtisrController.prueba);

// Export routes
module.exports = router;
