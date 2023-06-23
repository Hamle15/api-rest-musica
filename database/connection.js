// Import mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

// Connection method
const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/app_musica");
    console.log("Successfully connected to DB: app_musica");
  } catch (error) {
    console.log(error);
    throw new Error("!! Could not connect to the DataBase !!");
  }
};

// Export connection
module.exports = connection;
