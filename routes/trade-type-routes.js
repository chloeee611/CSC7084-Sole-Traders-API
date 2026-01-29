const express = require("express");
const controller = require("../controllers/trade-type-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getTradeTypes);

module.exports = router;
