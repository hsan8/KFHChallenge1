module.exports = (app) => {
  const paymentRoutes = require("./payment/routes/payment.routes");
  app.use("/payment", paymentRoutes);
};
