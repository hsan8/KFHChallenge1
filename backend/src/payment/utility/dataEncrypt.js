// Import the CryptoJS library for encryption
const CryptoJS = require("crypto-js");

// Define secret keys for encryption
const secretKeyCvv = process.env.ENCRYPTION_KEY_CVV;
const secretKeyCart = process.env.ENCRYPTION_KEY_CART;
const secretKeyPaymentSession = process.env.ENCRYPTION_KEY_PAYMENT_SESSION;

// Encrypts a credit card number using AES encryption
function encryptedCardNumber(cardNumber) {
  // Parse the secret key as a Base64-encoded string to create the initialization vector (iv)
  const iv = CryptoJS.enc.Base64.parse(secretKeyCart);
  // Parse the secret key as a UTF-8-encoded string to create the key
  const KeyUTF = CryptoJS.enc.Utf8.parse(secretKeyCart);
  // Encrypt the card number using AES with the iv and key
  return CryptoJS.AES.encrypt(cardNumber, KeyUTF, { iv: iv }).toString();
}

// Encrypts a CVV code using AES encryption
function encryptedCVV(cvv) {
  // Parse the secret key as a Base64-encoded string to create the initialization vector (iv)
  const iv = CryptoJS.enc.Base64.parse(secretKeyCvv);
  // Parse the secret key as a UTF-8-encoded string to create the key
  const KeyUTF = CryptoJS.enc.Utf8.parse(secretKeyCvv);
  // Encrypt the CVV code using AES with the iv and key
  return CryptoJS.AES.encrypt(cvv, KeyUTF, { iv: iv }).toString();
}

// Generates and encrypts a payment session key using AES encryption
function encryptedPaymentSessionKey() {
  // Generate a random session ID between 100000 and 999999
  const min = 100000;
  const max = 999999;
  const sessionID = Math.floor(Math.random() * (max - min + 1)) + min;
  // Encrypt the session ID using AES with the payment session key
  return CryptoJS.AES.encrypt(sessionID.toString(), secretKeyPaymentSession).toString();
}

// Export the functions so they can be used in other modules
module.exports = { encryptedCardNumber, encryptedCVV, encryptedPaymentSessionKey };
