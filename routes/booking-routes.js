const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/booking-controller");

router.get("/", controller.getAllBookings);
router.get("/:bookingId", controller.getBooking);
router.post("/", controller.postBooking);
router.put("/:bookingId", controller.putBooking);
router.patch("/:bookingId/status", controller.patchBookingStatus);
router.delete("/:bookingId", controller.deleteBooking);

module.exports = router;
