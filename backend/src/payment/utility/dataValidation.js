const Joi = require("joi");

const cardDetailsValidation = Joi.object({
  cardNumber: Joi.string().length(16).pattern(/^\d+$/).required(),
  cvv: Joi.string().length(3).pattern(/^\d+$/).required(),
  cardHolderName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required(),
  expirationMonth: Joi.number().integer().min(1).max(12).required(),
  expirationYear: Joi.number().integer().min(1900).max(9999).required(),
});

function isValidCard(number) {
  // Check if the credit card number is a valid length
  if (String(number).length < 13 || String(number).length > 19) {
    return false;
  }

  // Check if the credit card number is a valid type
  if (!isValidType(number)) {
    return false;
  }

  // Check if the credit card number is valid according to the Luhn algorithm
  if (!luhnAlgorithm(number)) {
    return false;
  }

  // If all checks pass, the credit card number is valid
  return true;
}

function luhnAlgorithm(number) {
  // Reverse the credit card number and convert it to an array of digits
  const digits = Array.from(String(number), Number).reverse();

  // Double every second digit
  const doubledDigits = digits.map((digit, index) => {
    if (index % 2 === 1) {
      return digit * 2;
    } else {
      return digit;
    }
  });

  // Add the digits of the doubled numbers
  const summedDigits = doubledDigits.map((digit) => {
    if (digit < 10) {
      return digit;
    } else {
      return digit - 9;
    }
  });

  // Calculate the total sum of the digits
  const total = summedDigits.reduce((accumulator, digit) => accumulator + digit, 0);

  // If the total is divisible by 10, the number is valid
  return total % 10 === 0;
}
module.exports = { cardDetailsValidation, isValidCard };
