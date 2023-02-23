function makePayment(req, res) {
  res.status(200).send({ message: "payment success" });
}
module.exports = { makePayment };
