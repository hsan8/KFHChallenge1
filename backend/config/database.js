const pg = require("pg");

const client = new pg.Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
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
