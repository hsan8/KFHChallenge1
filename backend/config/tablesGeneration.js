const { encryptedCVV, encryptedCardNumber } = require("../src/payment/utility/dataEncrypt");
const client = require("./database");

async function tablesGenerator() {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS customer (
        id SERIAL PRIMARY KEY,
        fullName TEXT NOT NULL,
        phoneNumber TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );`,
    );
    console.log("====> Table customer (if not exists) created successfully");

    await client.query(
      `CREATE TABLE IF NOT EXISTS account (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER NOT NULL REFERENCES customer(id),
                account_number TEXT NOT NULL UNIQUE,
                account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('savings account', 'current account', 'fixed deposit account', 'recurring deposit account')),
                current_balance DECIMAL(10, 2) NOT NULL CHECK (current_balance >= 0),
                currency VARCHAR(3) NOT NULL CHECK (currency = 'USD'),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
              );`,
    );
    console.log("====> Table account (if not exists) created successfully");

    await client.query(
      `CREATE TABLE IF NOT EXISTS credit_cards (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES customer(id),
        account_id INTEGER NOT NULL REFERENCES account(id),
        card_number_encrypted TEXT NOT NULL,
        cvv_encrypted TEXT NOT NULL,
        card_holder_name TEXT NOT NULL,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        expiration_month INTEGER NOT NULL,
        expiration_year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );`,
    );
    console.log("====> Table credit_cards (if not exists) created successfully");

    await client.query(
      `CREATE TABLE IF NOT EXISTS payment (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES customer(id),
        card_id INTEGER NOT NULL REFERENCES credit_cards(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        otp TEXT NOT NULL,
        otp_expiry_date TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '30 minutes',
        payment_session_key TEXT NOT NULL,
        payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
        payment_status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Failed', 'Captured'))
      );`,
    );
    console.log("====> Table payment (if not exists) created successfully");
    insertData();
    /**
     * add new customer "KFH customer" to the database to test the app
     */
  } catch (error) {
    console.log(error);
  }
}

async function insertData() {
  try {
    await client.query(`INSERT INTO customer (fullName, phoneNumber)
                         VALUES 
                         ('KFH customer one', '+96566666666'),
                         ('KFH customer two', '+96577777777')
                         ON CONFLICT (phoneNumber) DO NOTHING;`);
    console.log("====> customers inserted (if not already existing)");

    await client.query(`INSERT INTO account (customer_id, account_number, account_type, current_balance, currency) 
                         VALUES 
                         (1, '1234567890', 'savings account', 500.00, 'USD'),
                         (2, '0987654321', 'current account', 1000.00, 'USD')
                         ON CONFLICT DO NOTHING;`);
    console.log("====> Accounts inserted successfully");

    const cvv1 = encryptedCVV("123");
    const cvv2 = encryptedCVV("321");
    const cardNumber1 = encryptedCardNumber("1234567812345678");
    const cardNumber2 = encryptedCardNumber("9876543298765432");

    await client.query(`
    INSERT INTO credit_cards (customer_id, account_id, card_number_encrypted, cvv_encrypted, card_holder_name, expiration_month, expiration_year)
    SELECT c1.id, a1.id, '${cardNumber1}', '${cvv1}', 'KFH customer one', 10, 2024
    FROM customer c1, account a1
    WHERE c1.fullName = 'KFH customer one' AND a1.account_number = '1234567890'
    AND NOT EXISTS (
      SELECT 1 FROM credit_cards WHERE customer_id = c1.id AND account_id = a1.id
    );
  
    INSERT INTO credit_cards (customer_id, account_id, card_number_encrypted, cvv_encrypted, card_holder_name, expiration_month, expiration_year)
    SELECT c2.id, a2.id, '${cardNumber2}', '${cvv2}', 'KFH customer two', 12, 2025
    FROM customer c2, account a2
    WHERE c2.fullName = 'KFH customer two' AND a2.account_number = '0987654321'
    AND NOT EXISTS (
      SELECT 1 FROM credit_cards WHERE customer_id = c2.id AND account_id = a2.id
    );
  `);
    console.log("====> Credit cards inserted successfully (if not already exist)");
  } catch (err) {
    console.error(err);
  }
}

module.exports = { tablesGenerator };
