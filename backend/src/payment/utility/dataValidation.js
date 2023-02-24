const Joi = require("joi");

const cartdetaisValidation = Joi.object({
  cardNumber: Joi.string().length(16).pattern(/^\d+$/).required(),
  cvv: Joi.string().length(3).pattern(/^\d+$/).required(),
  cardHolderName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required(),
  expirationMonth: Joi.number().integer().min(1).max(12).required(),
  expirationYear: Joi.number().integer().min(1900).max(9999).required(),
});

module.exports = { cartdetaisValidation };
