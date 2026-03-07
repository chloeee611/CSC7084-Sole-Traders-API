const { body } = require("express-validator");

exports.serviceValidators = [
    body("title")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Title is a required field")
        .matches(/^[a-zA-Z\s,.]+$/)
        .withMessage("Title has invalid characters"),
    body("description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Description is a required field")
        .isLength({ min: 10, max: 600 })
        .withMessage("Description must be between 10 and 600 characters"),
    body("pricingType")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Pricing Type is a required field")
        .isIn(["Hourly", "Fixed"])
        .withMessage("Pricing Type must be either Hourly or Fixed"),
    body("basePrice")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Base Price is a required field")
        .isNumeric()
        .withMessage("Base Price must be a number"),
];
