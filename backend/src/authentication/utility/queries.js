const client = require("../../../config/database");

// This is an asynchronous function that selects a customer by OTP and phone number
async function selectCustomerByOTP(otp, phoneNumber) {
  try {
    const data = await client.query(
      `SELECT id, fullName, otp, currentBalance FROM customer WHERE otp='${otp}' AND phoneNumber='${phoneNumber}'`
    );
    // If the query does not return any rows, return an object with 'failed' status and a message
    if (data.rowCount < 1) return { status: "failed", message: "No customer with this credential" };
    // If the query returns data, return an object with 'ok' status and the data
    else return { status: "ok", data: data.rows[0] };
  } catch (error) {
    // If there is an error, return an object with 'error' status and a message
    if (error) return { status: "error", message: "somthing went wrong during you check otp process" };
  }
}
async function updateRefreshToken(id, newRefreshToken) {
  return client.query(`UPDATE customer SET refreshToken = '${newRefreshToken}' WHERE id = ${id}`);
}

async function getCustomerByID(id) {
  return client.query(`SELECT * FROM customer WHERE id = ${id}`);
}

module.exports = { selectCustomerByOTP, updateRefreshToken, getCustomerByID };
