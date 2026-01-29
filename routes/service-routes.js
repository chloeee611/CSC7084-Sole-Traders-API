const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/service-controller");

router.get("/", controller.getAllServices);
router.get("/:serviceId", controller.getService);
router.post("/", controller.postService);
router.put("/:serviceId", controller.putService);
router.delete("/:serviceId", controller.deleteService);

module.exports = router;
