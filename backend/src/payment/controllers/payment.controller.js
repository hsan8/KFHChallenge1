const { encryptedCVV, encryptedCardNumber } = require("../utility/dataEncrypt");
const { cartdetaisValidation } = require("../utility/dataValidation");

function makePayment(req, res) {
  console.log(req.cookies);
  const { error } = cartdetaisValidation.validate(req.body);
  if (error) {
    return res.status(200).json({ message: error.details[0].message });
  }
  const currentDate = new Date();
  const expirationDate = new Date(req.body.expirationYear, req.body.expirationMonth - 1, 1);

  if (expirationDate < currentDate) {
    return res.status(200).json({ message: "Expiration date must be greater than current today." });
  }
  let { cardNumber, cvv, cardHolderName, expirationMonth, expirationYear } = req.body;
  cvv = encryptedCVV(cvv);
  cardNumber = encryptedCardNumber(cardNumber);
  res.status(200).json({ message: "payment success" });
}
module.exports = { makePayment };
