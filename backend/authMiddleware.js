const jwt = require("jsonwebtoken"); // Import the `jsonwebtoken` module

// Export a middleware function that takes three parameters
exports.authMiddleware = (req, res, next) => {
  // Get the JWT tokens from the request cookies
  const tokens = req.cookies;

  // If there are no tokens, return an unauthorized error
  if (tokens == null) {
    return res.status(401).send({ response: "error", message: "User Unauthorized" });
  }

  // Verify the access token using the secret key
  jwt.verify(tokens.accessToken, process.env.accessTokenSecret, (err, user) => {
    if (err) {
      // If the token is invalid, return an authentication failed error
      return res.status(401).send({ response: "error", message: "Authentication failed" });
    } else {
      // If the token is valid, set the user property on the request object and call the next middleware
      req.user = user;
      next();
    }
  });
};
