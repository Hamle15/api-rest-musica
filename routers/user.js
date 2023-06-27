// Import dependencies
const express = require("express");

// Carge router
const router = express.Router();

// Import controller
const UserController = require("../controllers/user");

// Define routes
router.get("/test-user", UserController.prueba);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
// Export routes
module.exports = router;
