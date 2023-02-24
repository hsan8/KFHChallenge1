const client = require("./database");

function tablesGenrator() {
  client.query(
    "CREATE TABLE IF NOT EXISTS credit_cards (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL,  card_number_encrypted TEXT NOT NULL,  cvv_encrypted TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())",

    (err, res) => {
      if (err) throw err;
      console.log("Table credit_cards (if not exists) created successfully");
    }
  );
  client.query(
    "CREATE TABLE IF NOT EXISTS payment ( id SERIAL PRIMARY KEY,user_id INTEGER NOT NULL,amount DECIMAL(10, 2) NOT NULL,card_number_encrypted TEXT NOT NULL,cvv_encrypted TEXT NOT NULL,card_holder_name TEXT NOT NULL,expiration_month INTEGER NOT NULL,expiration_year INTEGER NOT NULL,payment_date TIMESTAMP NOT NULL DEFAULT NOW(),payment_status VARCHAR(20) NOT NULL DEFAULT 'Pending')",
    (err, res) => {
      if (err) throw err;
      console.log("Table payment (if not exists) created successfully");
    }
  );

  client.query(
    "CREATE TABLE IF NOT EXISTS customer (id SERIAL PRIMARY KEY,fullName TEXT NOT NULL,otp TEXT NOT NULL UNIQUE, phoneNumber TEXT NOT NULL UNIQUE,currentBalance DECIMAL(10, 2) DEFAULT 0.0 ,expiryDate TEXT NULL,refreshToken TEXT NULL,created_at TIMESTAMP DEFAULT NOW(),updated_at TIMESTAMP DEFAULT NOW())",
    (err, res) => {
      if (err) throw err;
      console.log("Table customer (if not exists) created successfully");
    }
  );

  /**
   * add new customer "KFH customer" to the database to test the app
   */
  client.query(
    `INSERT INTO customer (fullName, otp,phoneNumber)
     SELECT 'KFH customer', '1111', '+96566666666'
     WHERE NOT EXISTS (
       SELECT 1 FROM customer WHERE otp = '1111'
     )`,
    (err, res) => {
      if (err) throw err;
      console.log("Insert for customer test ");
    }
  );
}

module.exports = { tablesGenrator };
