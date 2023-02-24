const { updateCustomerAndRespond } = require("../services/auth.service");
const { selectCustomerByOTP } = require("../utility/queries");

async function checkOTP(req, res) {
  console.log(req.cookies);
  const { otp, phoneNumber } = req.body;
  const auth = await selectCustomerByOTP(otp, phoneNumber);
  if (auth.status != "ok") return res.send(400).json(auth);
  else await updateCustomerAndRespond(auth.data, res);
}
module.exports = { checkOTP };
