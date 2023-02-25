const jwt = require("jsonwebtoken");

/**
 * Export a function that takes in a payment object and a response object, generates a new payment session token using the payment object, sets a new payment session token cookie, and sends a response with a success message.
 *
 * @param {Object} payment - The payment object used to generate the payment session token.
 * @param {Object} res - The response object used to send the new payment session token cookie and success message.
 * @returns {Object} The response object with a success message.
 */
exports.updateResponse = async (payment_session_key, payment_id, res) => {
  // Generate a new payment session token using the payment object.
  const paymentSessionToken = generatePaymentSessionToken(payment_session_key, payment_id);
  // Set a new payment session token cookie and send with the response.
  accessCookie(paymentSessionToken, res);
  return res.status(200).json({ status: "ok", message: "Proceed to the next step for OTP confirmation." });
};

/**
 * Generates a new payment session token using the payment object.
 *
 * @param {Object} payment_session_key - The payment payment_session_key used to generate the payload.
 * @returns {string} A new payment session token.
 */
function generatePaymentSessionToken(payment_session_key, payment_id) {
  const payload = { payment_session_key: payment_session_key, payment_id: payment_id };
  return jwt.sign(payload, process.env.ENCRYPTION_KEY_ACCESS_TOEKN);
}

/**
 * Sets a new payment session token cookie.
 *
 * @param {string} paymentSessionToken - The new payment session token.
 * @param {Object} res - The response object used to send the new payment session token cookie.
 */
function accessCookie(paymentSessionToken, res) {
  const expiryDate = process.env.ENCRYPTION_KEY_ACCESS_TOEKN;
  sendCookie(res, "paymentSessionToken", true, paymentSessionToken, new Date(Date.now() + parseInt(expiryDate) * 1000));
}

/**
 * Sends a cookie with the specified key, value, and expiry date.
 *
 * @param {Object} res - The response object used to send the cookie.
 * @param {string} key - The key for the cookie.
 * @param {boolean} secureType - Determines whether the cookie should only be sent over HTTPS.
 * @param {string} value - The value for the cookie.
 * @param {Date} expiryDate - The expiry date for the cookie.
 */
function sendCookie(res, key, secureType, value, expiryDate) {
  res.cookie(key, value, { secure: secureType, httpOnly: true, expires: expiryDate });
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 * @returns
 */
exports.authMiddleware = (req, res, next) => {
  // Get the JWT tokens from the request cookies
  const tokens = req.cookies;
  // If there are no tokens, return an unauthorized error
  if (tokens == null) {
    return res.status(401).send({ response: "error", message: "User Unauthorized or session expired" });
  }

  // Verify the access token using the secret key
  jwt.verify(tokens.paymentSessionToken, process.env.ENCRYPTION_KEY_ACCESS_TOEKN, (err, payment) => {
    if (err) {
      // If the token is invalid, return an authentication failed error
      return res.status(401).send({ response: "error", message: "Unauthorized access" });
    } else {
      // If the token is valid, set the user property on the request object and call the next middleware
      req.payment = payment;
      next();
    }
  });
};
