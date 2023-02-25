const { encryptedPaymentSessionKey } = require("../utility/dataEncrypt");
const client = require("../../../config/database");
async function createPaymentSession(cardDetails) {
  let { customer_id, id } = cardDetails;
  const otp = "1111";
  const amount = 10;
  const query = `
          INSERT INTO payment (customer_id, card_id, amount, otp, payment_session_key)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
  const values = [customer_id, id, amount, otp, encryptedPaymentSessionKey()];
  const { rows } = await client.query(query, values);
  return rows[0];
}

async function checkOtp(paymentSessionKey, otp) {
  try {
    // First, check if the OTP is valid for the specified payment
    const checkOTP = await client.query("SELECT * FROM payment WHERE payment_session_key = $1 AND otp = $2 ", [paymentSessionKey, otp]);

    // If the OTP is not valid or has expired, return an error
    if (checkOTP.rows.length === 0) {
      return { status: "error", message: "Invalid or expired OTP" };
    }

    // Get the payment details
    const payment = checkOTP.rows[0];

    // Check if the OTP has expired
    const otpExpiryDate = new Date(payment.otp_expiry_date);
    if (otpExpiryDate < new Date()) return { status: "expired_otp", message: "OTP has expired" };
    if (payment.payment_status != "Pending") return { status: "payment_ended", message: "payment session already finished" };

    // Return the payment details
    return { status: "ok", data: payment };
  } catch (error) {
    // If there is an error, return an object with 'error' status and a message
    return { status: "error", message: "Something went wrong while getting payment details" };
  }
}

async function checkCardValidity(paymentData) {
  try {
    const { card_id } = paymentData;
    const result = await client.query(
      `SELECT *
      FROM customer
      INNER JOIN credit_cards ON customer.id = credit_cards.customer_id
      INNER JOIN account ON credit_cards.account_id = account.id
      WHERE credit_cards.id = $1`,
      [card_id],
    );
    // Assuming you have a variable named `data` that contains the card and account information
    const data = result.rows[0];
    // Check if the card has expired
    const currentDate = new Date();
    const expirationDate = new Date(data.expiration_year, data.expiration_month - 1, 1);
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    expirationDate.setDate(expirationDate.getDate() - 1);

    if (!data.active_status) {
      return { status: "card_deactivated", message: "Card is not active" };
    } else if (currentDate > expirationDate) {
      return { status: "card_expired", message: "Card has expired" };
    } else if (parseFloat(data.current_balance) < parseFloat(paymentData.amount)) {
      return { status: "no_funds", message: "Insufficient funds" };
    } else {
      return { status: "ok", data: data };
    }
  } catch (error) {
    return { status: "payment_failed", message: "Error while checking card status:" };
  }
}

async function finishPayment(paymentData, cardData) {
  try {
    // deduct the amount from the account balance
    await client.query(
      `UPDATE account SET current_balance = current_balance - $1
     WHERE id = $2 RETURNING current_balance`,
      [parseFloat(paymentData.amount), cardData.account_id],
    );
    // update the payment status to "captured"
    await client.query(
      `UPDATE payment SET payment_status = 'Captured'
     WHERE payment_session_key = $1`,
      [paymentData.payment_session_key],
    );
    return { status: "ok", message: "" };
  } catch (error) {
    return { status: "payment_failed", message: "Error while checking card status:" };
  }
}

module.exports = { createPaymentSession, checkOtp, checkCardValidity, finishPayment };
