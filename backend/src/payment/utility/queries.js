const client = require("../../../config/database");
const { encryptedCVV, encryptedCardNumber } = require("./dataEncrypt");
async function getCardDetails(cartNumber, cvv, cardHolderName, expiration_month, expiration_year) {
  try {
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
      [encryptedCardNumber(cartNumber), encryptedCVV(cvv), cardHolderName, parseInt(expiration_month), parseInt(expiration_year)],
    );
    if (creditCards.length === 0) return [];
    return creditCards;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get credit card details");
  }
}
 function updatePaymentToFailed(payment_id) {
  try {
    client.query('UPDATE payment SET payment_status = $1 WHERE id = $2', ['Failed', payment_id]);
  } catch (err) {
    throw new Error("Failed to update payment status");
  }
}

module.exports = { getCardDetails,updatePaymentToFailed };
