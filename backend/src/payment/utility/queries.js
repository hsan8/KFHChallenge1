// Require the database configuration file and the functions for data encryption
const client = require("../../../config/database");
const { encryptedCVV, encryptedCardNumber } = require("./dataEncrypt");

// Function to get credit card details from the database by encrypting the card number and CVV
async function getCardDetails(cartNumber, cvv, cardHolderName, expiration_month, expiration_year) {
  try {
    // Query the credit_cards table for a row that matches the encrypted card number, encrypted CVV, card holder name, expiration month, and expiration year
    const { rows: creditCards } = await client.query(
      `SELECT *
         FROM credit_cards
         WHERE card_number_encrypted = $1
           AND cvv_encrypted = $2
           AND card_holder_name = $3
           AND expiration_month = $4
           AND expiration_year = $5
           AND active_status = true
         LIMIT 1;`,
      [
        encryptedCardNumber(cartNumber),
        encryptedCVV(cvv),
        cardHolderName,
        parseInt(expiration_month),
        parseInt(expiration_year),
      ]
    );
    // If no credit cards are found, return an empty array
    if (creditCards.length === 0) return [];
    // Otherwise, return the credit card(s) found
    return creditCards;
  } catch (err) {
    // Log any errors and throw an error message
    console.error(err);
    throw new Error("Failed to get credit card details");
  }
}

// Function to update a payment's status to "Failed"
function updatePaymentToFailed(payment_id) {
  try {
    // Update the payment table to set the payment_status to "Failed" for the given payment_id
    client.query("UPDATE payment SET payment_status = $1 WHERE id = $2", ["Failed", payment_id]);
  } catch (err) {
    // Throw an error message if the update fails
    throw new Error("Failed to update payment status");
  }
}

// Export the two functions for use in other files
module.exports = { getCardDetails, updatePaymentToFailed };
