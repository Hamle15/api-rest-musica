// Imports
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const validate = require("../helpers/validate");
const jwt = require("../helpers/jwt");
const fs = require("fs");
const path = require("path");

// Test accion
const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "Message sended from: controllers/user.js",
  });
};

const register = (req, res) => {
  // Take the data of the body
  let params = req.body;

  // Check that it fits me well
  const requiredFields = ["name", "nick", "email", "password"];
  const missingFields = [];

  requiredFields.forEach((field) => {
    if (!params[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return res.status(400).send({
      status: "error",
      message: `The following field(s) are missing: ${missingFields.join(
        ", "
      )}`,
    });
  }

  // Validate data
  try {
    validate(params);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Validate fail",
      error: error.message,
    });
  }

  // Control duplicate users
  User.find({
    $or: [{ email: params.email }, { nick: params.nick }],
  }).then(async (user) => {
    if (user && user.length >= 1) {
      return res.status(409).send({
        status: "error",
        message: "The User alredy exist",
      });
    }

    // ENCRYPTION PASSWORD
    let pdw = await bcrypt.hash(params.password, 10);
    params.password = pdw;

    // Create user Object
    let user_to_save = new User(params);

    // Save in the data base
    user_to_save
      .save()
      .then((userStored) => {
        if (!userStored) {
          return res.status(500).send({
            status: "error",
            message: "Error to save the User",
          });
        }

        // Clean the obj to return
        let userCreated = userStored.toObject();
        delete userCreated.password;
        delete userCreated.role;
        // Return result
        return res.status(200).json({
          status: "success",
          message: "User registered successfully",
          user: userCreated,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          status: "error",
          message: "Error to save the User",
        });
      });
  });
};

const registerAdmin = (req, res) => {
  const params = req.body;

  // Check that it fits me well
  const requiredFields = ["name", "nick", "email", "password"];
  const missingFields = [];

  requiredFields.forEach((field) => {
    if (!params[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return res.status(400).send({
      status: "error",
      message: `The following field(s) are missing: ${missingFields.join(
        ", "
      )}`,
    });
  }

  // Validate data
  try {
    validate(params);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Validate fail",
      error: error.message,
    });
  }

  User.find({
    $or: [{ email: params.email }, { nick: params.nick }],
  }).then(async (user) => {
    if (user && user.length >= 1) {
      return res.status(409).send({
        status: "error",
        message: "The User alredy exist",
      });
    }

    // ENCRYPTION PASSWORD
    let pdw = await bcrypt.hash(params.password, 10);
    params.password = pdw;

    // CHANGE THE ROLE
    params.role = "role_admin";

    // Create user Object
    let user_to_save = new User(params);

    // Save in the data base
    user_to_save
      .save()
      .then((userStored) => {
        if (!userStored) {
          return res.status(500).send({
            status: "error",
            message: "Error to save the User",
          });
        }

        // Clean the obj to return
        let userCreated = userStored.toObject();
        delete userCreated.password;
        delete userCreated.role;
        // Return result
        return res.status(200).json({
          status: "success",
          message: "User registered successfully",
          user: userCreated,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          status: "error",
          message: "Error to save the User",
        });
      });
  });
};

const login = (req, res) => {
  // Take the params of the peticion
  let params = req.body;

  const email = params.email.trim();
  const password = params.password.trim();

  // Check if the data get
  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      message: "Missing data",
    });
  }

  // Look email in the bd if the user exist
  User.findOne({ email: email })
    .select("+password +role -__v ")
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: "error",
          message: "Could not find the user",
        });
      }

      // Check the password
      const pdw = bcrypt.compareSync(password, user.password);

      if (!pdw) {
        return res.status(400).send({
          status: "error",
          message: "Mail o password Incorrect",
        });
      }

      let identityUser = user.toObject();
      delete identityUser.password;
      delete identityUser.role;

      // Get the token
      const token = jwt.createToken(user);

      // Return token and data user
      return res.status(200).send({
        status: "succes",
        message: "Login succes",
        user: identityUser,
        token,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "Could not find the user",
        error: error.message,
      });
    });
};

const profile = (req, res) => {
  // Take id from the url
  const id = req.params.id;

  // Look data porfile
  User.findById(id)
    .select("-__v")
    .then((userProfile) => {
      if (!userProfile) {
        return res.status(404).send({
          status: "error",
          message: "The user did not exist",
        });
      }

      // Return result
      return res.status(200).send({
        status: "succes",
        message: "Profile",
        user: userProfile,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "The user did not exist",
      });
    });
};

const update = (req, res) => {
  // Take the info of the user identify
  let userIdentidy = req.user;
  let userUpdate = req.body;
  let nick = userUpdate.nick;
  console.log(nick, "holaaaaa");
  // Data to update
  User.find({
    $or: [{ email: userUpdate.email }, { nick: userUpdate.nick }],
  })
    .then(async (users) => {
      if (!users) {
        return res.status(500).send({
          status: "error",
          message: "Internal",
        });
      }
      // Check the user exist and i if i am not
      let userIsset = false;
      users.forEach((user) => {
        if (user && user._id != userIdentidy.id) userIsset = true;
      });
      // If exist return a res
      if (userIsset == true) {
        return res.status(409).send({
          status: "succes",
          message: "The user alredy exist",
        });
      }

      // Encrypt password
      if (userUpdate.password) {
        let pdw = await bcrypt.hash(userUpdate.password, 10);
        userUpdate.password = pdw;
      } else {
        delete userUpdate.password;
      }

      try {
        // Look user and update
        let usertoUpdate = await User.findByIdAndUpdate(
          { _id: userIdentidy.id },
          userUpdate,
          { new: true }
        );

        if (!userUpdate) {
          return res.status(500).send({
            status: "error",
            message: "Internal Error",
            error: error.message,
          });
        }

        return res.status(200).send({
          status: "succes",
          user: usertoUpdate,
        });
      } catch (error) {
        return res.status(500).send({
          status: "error",
          message: "Internal",
          error: error.message,
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "Internal",
        error: error.message,
      });
    });
};

const upload = (req, res) => {
  // Take the img and check if exist
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "The peticion do not include the img",
    });
  }

  // Take the name of the archive
  let image = req.file.originalname;

  // Take the info of the img
  const imageSplit = image.split(".");

  const extension = path.extname(image).toLowerCase();

  // Check the extension
  if (
    extension != ".png" &&
    extension != ".jpg" &&
    extension != ".jpeg" &&
    extension != ".gif"
  ) {
    // Delete Image
    const filePath = req.file.path;
    const fileDelete = fs.unlinkSync(filePath);

    // Return res negative
    return res.status(406).send({
      status: "error",
      message: "The extension of the img is not valid",
    });
  }
  // Save the img in bd
  User.findByIdAndUpdate(
    { _id: req.user.id },
    { image: req.file.filename },
    { new: true }
  )
    .then((userUpdate) => {
      if (!userUpdate) {
        return res.status(500).send({
          status: "error",
          message: "error in the upload",
        });
      }
      return res.status(200).send({
        status: "succes",
        user: userUpdate,
        file: req.file,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "error in the upload",
      });
    });
};

const avatar = (req, res) => {
  // Take params url
  const file = req.params.file;

  // Mont the path
  const filePath = "./uploads/avatars/" + file;

  // Check if the img exist
  fs.stat(filePath, (error, exist) => {
    if (file == "default.png") {
      return res.status(404).send({
        status: "error",
        message: "Is the default img",
      });
    }
    if (!exist || error) {
      return res.status(404).send({
        status: "error",
        message: "the img do not exist",
      });
    }
    // Return file
    return res.sendFile(path.resolve(filePath));
  });
};

// Export accions
module.exports = {
  prueba,
  register,
  registerAdmin,
  login,
  profile,
  update,
  upload,
  avatar,
};
