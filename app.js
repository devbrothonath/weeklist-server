const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

const app = express();

const port = process.env.PORT;

const dbURL = process.env.DB_URL;

mongoose
  .connect(dbURL)
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.send("Successful response");
});

let serverState = "active";

app.get("/health", (req, res) => {
  const currentTime = new Date().toLocaleTimeString();
  if (serverState == "active") {
    res
      .status(200)
      .json({ servername: "Week list server", currentTime, serverState });
  } else {
    res
      .status(500)
      .json({ servername: "Week list server", currentTime, serverState });
  }
});
app.use(authRoutes);

app.use((req, res) => {
  res.status(404).send("Seems like this page does not exist");
});
