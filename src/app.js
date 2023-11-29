require("dotenv").config();
const port = process.env.APP_PORT;
const express = require("express");
const app = express();
const movieControllers = require("./controllers/movieControllers");
const userControllers = require("./controllers/userControllers");
const validateMovie = require("./middlewares/validateMovie");
const validateUser = require("./middlewares/validateUser");

app.use(express.json());
app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", userControllers.getUsers);
app.get("/api/users/:id", userControllers.getUserById);
app.put("/api/movies/:id", movieControllers.updateMovie);
app.post("/api/movies", validateMovie, movieControllers.postMovie);
app.post("/api/users", validateUser, userControllers.postUsers);

module.exports = app;
