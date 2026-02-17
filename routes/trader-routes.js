const express = require("express");
const controller = require("../controllers/trader-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getAllTraders);
router.get("/:traderId", controller.getTrader);
router.put("/:traderId", controller.putTraderDetails);

router.get("/:traderId/services", controller.getAllServicesForTrader);
router.get("/:traderId/services/:serviceId", controller.getServiceForTrader);
router.post("/:traderId/services", controller.postServiceForTrader);
router.put("/:traderId/services/:serviceId", controller.putServiceForTrader);
router.delete(
    "/:traderId/services/:serviceId",
    controller.deleteServiceForTrader,
);

router.get("/:traderId/ratings", controller.getAllRatingsForTrader);
router.get("/:traderId/ratings/:ratingId", controller.getRatingForTrader);
router.post("/:traderId/ratings", controller.postRatingForTrader);
router.put("/:traderId/ratings/:ratingId", controller.putRatingForTrader);
router.delete("/:traderId/ratings/:ratingId", controller.deleteRatingForTrader);

module.exports = router;
