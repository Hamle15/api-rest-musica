const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  surname: String,
  nick: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  role: {
    type: String,
    default: "role_user",
    enum: ["role_user", "role_admin"], // This is for verify that the only can be allowed this type of role
    select: false,
  },
  image: {
    type: String,
    default: "image.png",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("User", UserSchema, "users");
//users, this make reference to how will be the model named in mongoDB
