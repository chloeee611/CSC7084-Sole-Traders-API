const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/booking-controller");
const validateJwt = require("../middleware/jwtMiddleware");

router.get("/", validateJwt, controller.getAllBookings);
router.get("/:bookingId", validateJwt, controller.getBooking);
router.post("/", validateJwt, controller.postBooking);
router.put("/:bookingId", validateJwt, controller.putBooking);
router.patch("/:bookingId/status", validateJwt, controller.patchBookingStatus);
router.delete("/:bookingId", validateJwt, controller.deleteBooking);

router.get("/data/date", controller.getBookingsByDate);
router.get("/data/service", controller.getBookingsByService);

module.exports = router;
