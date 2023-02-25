const { updateResponse } = require("../../authentication/controllers/auth.controller");
const { createPaymentSession, checkOtp, checkCardValidity, finishPayment } = require("../services/paymentSession.service");
const { cardDetailsValidation } = require("../utility/dataValidation");
const { getCardDetails, updatePaymentToFailed } = require("../utility/queries");

/**
 * Creates a payment session using the card details provided in the request body, sends an OTP to the user's phone number, and sets a payment session key cookie in the response.
 *
 * @param {Object} req - The request object containing the card details.
 * @param {Object} res - The response object used to send the payment session key cookie.
 * @returns {Object} The response object with a payment session key cookie.
 */
async function createPayment(req, res) {
  // Validate the card details in the request body.
  const { error } = cardDetailsValidation.validate(req.body);
  if (error) {
    return res.status(200).json({ message: error.details[0].message });
  }

  // Ensure the expiration date is in the future.
  const currentDate = new Date();
  const expirationDate = new Date(req.body.expirationYear, req.body.expirationMonth - 1, 1);
  if (expirationDate < currentDate) {
    return res.status(200).json({ message: "Expiration date must be greater than current today." });
  }

  // Get the card details using the provided card number, CVV, cardholder name, expiration month, and expiration year.
  let { cardNumber, cvv, cardHolderName, expirationMonth, expirationYear } = req.body;
  const cartDetails = await getCardDetails(cardNumber, cvv, cardHolderName, expirationMonth, expirationYear);

  // Return an error if the card details are invalid.
  if (cartDetails.length === 0) {
    return res.status(200).json({status: "invalid_card", message: "Invalid card details" });
  }

  // Create a payment session using the retrieved card details and generate an OTP to be sent to the user's phone number.
  let { payment_session_key, otp, id } = await createPaymentSession(cartDetails[0]);
  // Send the OTP to the user's phone number.
  // Set a payment session key cookie in the response and send a success message to the user.
  return updateResponse(payment_session_key, id, res);
}

async function validatePayment(req, res) {
  const { payment_session_key, payment_id } = req.payment;
  const { otp } = req.body;

  if (!payment_session_key || !payment_id || !otp) return res.status(200).json({ status: "input_error", message: "Invalid payment details" });

  // check otp and session validity
  const resultOtp = await checkOtp(payment_session_key, otp);
  if (resultOtp.status != "ok") {
    updatePaymentToFailed();
    return res.status(200).json({ status: resultOtp.status, message: resultOtp.message });
  }

  const resultCard = await checkCardValidity(resultOtp.data);
  if (resultCard.status != "ok") {
    updatePaymentToFailed();
    return res.status(200).json({ status: resultCard.status, message: resultCard.message });
  }

  const finishTransaction = await finishPayment(resultOtp.data, resultCard.data);
  if (finishTransaction.status != "ok") {
    updatePaymentToFailed();
    return res.status(200).json({ status: finishTransaction.status, message: finishTransaction.message });
  }
  res.send({ status: "ok", message: "payment successfully completed" });
}

module.exports = { createPayment, validatePayment };
