const express = require("express");
const controller = require("../controllers/trader-controller");
const { serviceValidators } = require("../middleware/validators");
const validateJwt = require("../middleware/jwtMiddleware");

const router = express.Router({ mergeParams: true });

router.get("/", controller.getAllTraders);
router.get("/:traderId", controller.getTrader);
router.put("/:traderId", validateJwt, controller.putTraderDetails);

router.get("/:traderId/services", controller.getAllServicesForTrader);
router.get(
    "/:traderId/services/:serviceId",
    validateJwt,
    controller.getServiceForTrader,
);
router.post(
    "/:traderId/services",
    validateJwt,
    serviceValidators,
    controller.postServiceForTrader,
);
router.put(
    "/:traderId/services/:serviceId",
    validateJwt,
    serviceValidators,
    controller.putServiceForTrader,
);
router.delete(
    "/:traderId/services/:serviceId",
    validateJwt,
    controller.deleteServiceForTrader,
);

router.get("/:traderId/ratings", controller.getAllRatingsForTrader);
router.get("/:traderId/ratings/:ratingId", controller.getRatingForTrader);
router.post("/:traderId/ratings", controller.postRatingForTrader);
router.put("/:traderId/ratings/:ratingId", controller.putRatingForTrader);
router.delete("/:traderId/ratings/:ratingId", controller.deleteRatingForTrader);

module.exports = router;
