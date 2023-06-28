// Import dependencies
const express = require("express");
const check = require("../middlewares/auth");

// Carge router
const router = express.Router();

// Import controller
const UserController = require("../controllers/user");

// Define routes
router.get("/test-user", UserController.prueba);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.put("/update", check.auth, UserController.update);
// Export routes
module.exports = router;
