// Import dependencies
const express = require("express");
const check = require("../middlewares/auth");

// Configuaracion of upload
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars/");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

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
router.post(
  "/upload",
  [check.auth, uploads.single("file0")], // This is goin to be the name of the field of the img
  UserController.upload
);
router.get("/avatar/:file", UserController.avatar);
// Export routes
module.exports = router;
