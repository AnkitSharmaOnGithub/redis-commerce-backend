const express = require("express");

// Import the 3rd party packages
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
var cors = require('cors');
const session = require('express-session');

// Initialize the 3rd party packages
dotenv.config();

// Create the server
const server = express();
server.use(cors({
  origin : 'http://localhost:4200',
  methods : ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials : true
}));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.set('trust proxy', 1) // trust first proxy
server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Import the inhouse files
const userRoutes = require('./routes/user.route');
server.use('/user', userRoutes);
const itemRoutes = require('./routes/item.route');
server.use('/item', itemRoutes);

// Make the server listen to the PORT(env file)
server.use((error, req, res, next) => {
  console.log(error);
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
