const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
// require the data base connection
require("./config/database");
// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Parse cookies
app.use(cookieParser());
require("./src/routes")(app);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
