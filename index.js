// Import conection to data base
const connection = require("./database/connection");

// Import dependencies
const express = require("express");
const cors = require("cors");

// Welcome message
console.log("API REST whit Node for a music app, ¡¡started!!");

// Run DB
connection();

// Create node server
const app = express();
const port = 3910;

// Set up cors
app.use(cors());

// Convert body data to objects js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load routes configuration
const UserRoutes = require("./routers/user");
const ArtistRoutes = require("./routers/artist");
const AlbumRoutes = require("./routers/album");
const SongRoutes = require("./routers/song");

app.use("/api/user", UserRoutes);
app.use("/api/artist", ArtistRoutes);
app.use("/api/album", AlbumRoutes);
app.use("/api/song", SongRoutes);

// Test path
app.get("/test-route", (req, res) => {
  return res.status(200).json({
    id: 1,
    nombre: "Hamlet",
    Apellido: "Pirazan",
  });
});

// Set the server to listen for http requests
app.listen(port, () => {
  console.log("The server of node is listening in the port: " + port);
});
