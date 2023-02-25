const CryptoJS = require("crypto-js");
// Define a secret key for encryption
const secretKeyCvv = process.env.ENCRYPTION_KEY_CVV;
const secretKeyCart = process.env.ENCRYPTION_KEY_CART;
const secretKeyPaymentSession = process.env.ENCRYPTION_KEY_PAYMENT_SESSION;

// Encrypt the credit card number and CVV using AES encryption
function encryptedCardNumber(cardNumber) {
  const iv = CryptoJS.enc.Base64.parse(secretKeyCart);
  const KeyUTF = CryptoJS.enc.Utf8.parse(secretKeyCart);
  return CryptoJS.AES.encrypt(cardNumber, KeyUTF, { iv: iv }).toString();
}
function encryptedCVV(cvv) {
  const iv = CryptoJS.enc.Base64.parse(secretKeyCvv);
  const KeyUTF = CryptoJS.enc.Utf8.parse(secretKeyCvv);
  return CryptoJS.AES.encrypt(cvv, KeyUTF, { iv: iv }).toString();
}

function encryptedPaymentSessionKey() {
  const min = 100000;
  const max = 999999;
  const sessionID = Math.floor(Math.random() * (max - min + 1)) + min;
  return CryptoJS.AES.encrypt(sessionID.toString(), secretKeyPaymentSession,).toString();
}

module.exports = { encryptedCardNumber, encryptedCVV, encryptedPaymentSessionKey };
