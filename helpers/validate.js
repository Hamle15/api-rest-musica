const validator = require("validator");

const validate = (params) => {
  let name = params.name;

  if (
    validator.isEmpty(name) ||
    !validator.isLength(name, { min: 3, max: undefined }) ||
    !validator.isAlpha(name, "es-ES")
  ) {
    let errors = [];
    if (validator.isEmpty(name)) {
      errors.push("Name cannot be empty");
    }
    if (!validator.isLength(name, { min: 3, max: undefined })) {
      errors.push("Name should have a minimum length of 3 characters");
    }
    if (!validator.isAlpha(name, "es-ES")) {
      errors.push("Name should only contain alphabetic characters");
    }
    throw new Error(`Name validation failed: ${errors.join(", ")}`);
  }

  let nick = params.nick;

  if (
    validator.isEmpty(nick) ||
    !validator.isLength(nick, { min: 2, max: 60 })
  ) {
    let errors = [];
    if (validator.isEmpty(nick)) {
      errors.push("Nick cannot be empty");
    }
    if (!validator.isLength(nick, { min: 2, max: 60 })) {
      errors.push("Nick should have a length between 2 and 60 characters");
    }
    throw new Error(`Nick validation failed: ${errors.join(", ")}`);
  }

  let email = params.email;

  if (validator.isEmpty(email) || !validator.isEmail(email)) {
    let errors = [];
    if (validator.isEmpty(email)) {
      errors.push("Email cannot be empty");
    }
    if (!validator.isEmail(email)) {
      errors.push("Please provide a valid email address");
    }
    throw new Error(`Email validation failed: ${errors.join(", ")}`);
  }

  if (typeof params.surname !== "undefined") {
    let surname = params.surname;

    if (
      !validator.isLength(surname, { min: 3, max: undefined }) ||
      !validator.isAlpha(surname, "es-ES")
    ) {
      let errors = [];

      if (validator.isEmpty(surname)) {
        errors.push("Surname cannot be empty");
      }
      if (!validator.isLength(surname, { min: 3, max: undefined })) {
        errors.push("Surname should have a minimum length of 3 characters");
      }
      if (!validator.isAlpha(surname, "es-ES")) {
        errors.push("Surname should only contain alphabetic characters");
      }

      throw new Error(`Surname validation failed: ${errors.join(". ")}`);
    }
  }
};

module.exports = validate;
