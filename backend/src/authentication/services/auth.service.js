const jwt = require("jsonwebtoken");
const { updateRefreshToken, getCustomerByID } = require("../utility/queries");

// Export a function that takes in a customer object and a response object and updates the customer's access and refresh tokens.
exports.updateCustomerAndRespond = async (customer, res) => {
  // Generate a new access token using the customer object.
  const accessToken = generateAccessToken(customer);

  // Update the customer's refresh token in the database and set a new refresh token cookie and send with the response
  let refresh = await updateCustomer(customer);
  if (refresh) {
    refreshCookie(refresh, res);
    // Set a new access token cookie and send with the response
    accessCookie(accessToken, res);
    return res.json({ fullname: customer.fullname, currentbalance: parseFloat(customer.currentbalance) });
  } else {
    return res.json({ message: "somthing went wrong" });
  }
};

//Send access token as cookie
function accessCookie(accessToken, res) {
  let expiryDate = process.env.ACCESS_TOKEN_EXPIRY;
  sendCookie(res, "accessToken", true, accessToken, new Date(Date.now() + parseInt(expiryDate) * 1000));
}

//expire cookie with refresh-token after a X muintes
function refreshCookie(refreshToken, res) {
  let expiryDate = process.env.REFRESH_TOKEN_EXPIRY;
  if (refreshToken)
    sendCookie(res, "refreshToken", true, refreshToken, new Date(Date.now() + parseInt(expiryDate) * 1000));
}

function sendCookie(res, key, secureType, value, expiryDate) {
  res.cookie(key, value, { secure: false, httpOnly: true, expires: expiryDate });
}

//Update refresh tokens in customers
async function updateCustomer(customer) {
  let refreshToken = generateRefreshToken(customer);
  return updateRefreshToken(customer.id, refreshToken)
    .then(() => {
      return refreshToken;
    })
    .catch(() => {
      return null;
    });
}

//Generate Access token
function generateAccessToken(customer) {
  let payload = { customerID: customer.id, phoneNumber: customer.phonenumber };
  return jwt.sign(payload, process.env.ENCRYPTION_KEY_ACCESS_TOEKN);
}

//Generate Refresh token
function generateRefreshToken(customer) {
  let payload = { customerID: customer.id, phoneNumber: customer.phonenumber };
  return jwt.sign(payload, process.env.ENCRYPTION_KEY_REFRESH_TOEKN);
}

// This function generates a new token from a refresh token
exports.token = (req, res) => {
  const refreshToken = req.body.token; // Retrieve the refresh token from the request body

  // Check if refresh token is provided, if not, send an error response and return from the function
  if (refreshToken == null) {
    return res.send({ response: "error", message: "Please provide refresh-token" });
  }

  // Get customer details from the refresh token using JSON Web Token library's `verify` function
  jwt.verify(refreshToken, process.env.ENCRYPTION_KEY_REFRESH_TOEKN, (err, customer) => {
    // If an error occurs during token verification, send an error response and return from the function
    if (err) {
      return res.status(401).send({ response: "error", message: "Invalid signature" });
    }

    // Check the refresh token against the customer's stored refresh token in the database
    getCustomerByID(customer.customerID).then(async (cusData) => {
      // If the customer exists and has a valid refresh token, set the customer ID in the request object
      if (customer && cusData.rows[0].refreshToken) {
        req.customerID = cusData.rows[0].id;

        // If the provided refresh token does not match the stored refresh token, send an error response and return from the function
        if (refreshToken !== cusData.rows[0].refreshToken) {
          return res.send({ response: "error", message: "Invalid refresh-token" });
        } else {
          // If the refresh token is valid, update the customer's details and send a success response
          this.updateCustomerAndRespond(cusData.rows[0], res);
          res.send({ response: "success", message: "Token refreshed" });
        }
      } else {
        // If the customer does not exist or does not have a valid refresh token, send an error response and return from the function
        res.send({ response: "error", message: "customer not found" });
      }
    });
  });
};
