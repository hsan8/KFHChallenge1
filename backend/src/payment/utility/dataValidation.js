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

function isValidLuhnNumber(cardNumber) {
  var sum = 0;
  var shouldDouble = false;
  for (var i = cardNumber.length - 1; i >= 0; i--) {
    var digit = parseInt(cardNumber.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 == 0;
}

module.exports = { cardDetailsValidation, isValidLuhnNumber };
