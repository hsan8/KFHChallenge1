module.exports = (app) => {
  const paymentRoutes = require("./payment/routes/payment.routes");
  const authRoutes = require("./authentication/routes/auth.routes");
  app.use("/payment", paymentRoutes);
  app.use("/auth", authRoutes);
};
