const pg = require("pg");

const client = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1",
  port: 5432,
});
client
  .connect()
  .then((success) => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log("connection failed", error);
  });
module.exports = client;
