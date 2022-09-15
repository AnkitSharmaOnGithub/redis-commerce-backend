const express = require("express");

// Import the 3rd party packages
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Initialize the 3rd party packages
bodyParser.urlencoded({ extended: false });
dotenv.config();

// Create the server
const server = express();

// Make the server listen to the PORT(env file)
server.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

server.listen(process.env.PORT, () =>
  console.log(`Server is listening for requests at port at http://localhost:${process.env.PORT}`)
);

/*
    TODO: Make the outlines of the routes


    TODO: Make the outlines of the redis DB in notebook
*/
