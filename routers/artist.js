// Import dependencies
const express = require("express");
const check = require("../middlewares/auth");

// Carge router
const router = express.Router();

// Import controller
const ArtistController = require("../controllers/artist");

// Define routes
router.get("/test-artist", ArtistController.prueba);
router.post("/save", check.auth, ArtistController.save);
router.get("/one/:id", check.auth, ArtistController.one);
// Export routes
module.exports = router;
