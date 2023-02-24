// Require the Express module
const express = require("express");

// Create an Express application
const app = express();

// Require the HTTP module
let http = require("http");

// Create an HTTP server with the Express application
const server = http.createServer(app);

// Require the Body Parser module
const bodyParser = require("body-parser");

// Require the dotenv module and load environment variables from a .env file
const dotenv = require("dotenv");
dotenv.config();

// Require the Cookie Parser module
const cookieParser = require("cookie-parser");

// Use Body Parser middleware to parse JSON request bodies with a limit of 50mb
app.use(bodyParser.json({ limit: "50mb" }));

// Use Body Parser middleware to parse URL-encoded request bodies with a limit of 50mb
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Use Cookie Parser middleware to parse cookies
app.use(cookieParser());

// Require the CORS module
const cors = require("cors");

// Use CORS middleware to allow access only from the specified frontend host
// app.use(cors({ credentials: true, origin: process.env.FRONT_END_BASE_URL }));

// Require the table generation module to generate database tables on the first run
require("./config/tablesGeneration").tablesGenrator();

// Require a custom constant module
require("./constant");

// Create a route to handle root requests
app.get("/", (req, res) => {
  res.send(
    "Server. Version: " +
      global.buildVersion +
      " | Built Date : " +
      global.buildDate +
      " | Server Start Time: " +
      new Date()
  );
});

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Parse cookies
app.use(cookieParser());

// Require the routes module and pass the Express application to it
require("./src/routes")(app);

// Start the server and listen for incoming requests
server.listen(process.env.SERVER_PORT, () => {
  console.log("Server Start Time: ", new Date());
  console.log(`Server listening on port ${process.env.SERVER_PORT}!`);
});

// Handle uncaught exceptions
process.on("uncaughtException", function (err) {
  console.log(err);
  console.log("uncaughtException @ " + new Date());
});

// Handle internal server errors
app.use(function (err, req, res, next) {
  console.log(err);
  console.log("Internal Server Error Caught @ " + new Date());
  if (err instanceof SyntaxError) res.send({ status: "error", message: "Syntax error in request" });
  else res.status(500).send({ status: "error", data: err });
});
