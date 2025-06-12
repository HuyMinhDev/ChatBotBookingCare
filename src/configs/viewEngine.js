import express from "express";

// config view engine for an express application
let configViewEngine = (app) => {
  app.use(express.static("./src/public")); // serve static files from the public directory
  app.set("view engine", "ejs"); // set the view engine to ejs
  app.set("views", "./src/views"); // set the views directory
};

module.exports = configViewEngine;
