const CryptoJS = require("crypto-js");
// Define a secret key for encryption
const secretKeyCvv = process.env.ENCRYPTION_KEY_CVV;
const secretKeyCart = process.env.ENCRYPTION_KEY_CART;

// Encrypt the credit card number and CVV using AES encryption
function encryptedCardNumber(cardNumber) {
  return CryptoJS.AES.encrypt(cardNumber, secretKeyCart).toString();
}
function encryptedCVV(cvv) {
  return CryptoJS.AES.encrypt(cvv, secretKeyCvv).toString();
}

module.exports = { encryptedCardNumber, encryptedCVV };
