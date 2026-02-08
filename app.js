const express = require("express");
const morgan = require("morgan");
require("dotenv").config({ path: "./config.env" });

const traderRouter = require("./routes/trader-routes");
const tradeTypeRouter = require("./routes/trade-type-routes");
const loginRouter = require("./routes/login-routes");
const registerRouter = require("./routes/register-routes");
const bookingRouter = require("./routes/booking-routes");

const PORT = process.env.PORT;

var app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/traders", traderRouter);
app.use("/trade-types", tradeTypeRouter);
app.use("/trader-login", loginRouter);
app.use("/trader-register", registerRouter);
app.use("/bookings", bookingRouter);

app.listen(PORT, (err) => {
    if (err) return console.log(err);
    console.log(`Express Web Server listening on http://localhost:${PORT}`);
});
