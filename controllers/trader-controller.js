const conn = require("../utils/dbconn");
const {
    validateRequiredStringField,
    validateRequiredNumberField,
    validatePricingType,
} = require("../utils/validators");

//#region Trader

exports.getAllTraders = (req, res) => {
    // TODO: pick all fields except password. Dunno if that means picking them all manually or if there's a smart MySQL way to do that
    const selectSQL = `
        SELECT * 
        FROM traders 
        LEFT JOIN trade_types
        ON traders.trade_type_id = trade_types.trade_type_id
        `;
    // TODO: add has_profile to trader
    // WHERE traders.has_profile = true

    conn.query(selectSQL, (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else {
            res.status(200);
            res.json({
                status: "success",
                message: `${rows.length} records retrieved`,
                result: rows,
            });
        }
    });
};

exports.getTrader = (req, res) => {
    const { traderId } = req.params;

    const selectSQL = `        
        SELECT * 
        FROM traders 
        LEFT JOIN trade_types
        ON traders.trade_type_id = trade_types.trade_type_id
        WHERE trader_id = ${traderId}
        `;

    conn.query(selectSQL, (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else if (rows.length === 0) {
            res.status(404);
            res.json({
                status: "failure",
                message: "Trader does not exist",
            });
        } else {
            res.status(200);
            res.json({
                status: "success",
                message: `${rows.length} records retrieved`,
                result: rows[0],
            });
        }
    });
};

exports.putTraderDetails = (req, res) => {
    const { traderId } = req.params;
    const { tradeType, region, availability, bio } = req.body;

    const validationResults = {};

    if (!validateRequiredStringField(region)) {
        validationResults["region"] = "Region is a required field";
    }

    if (!validateRequiredStringField(availability)) {
        validationResults["availability"] = "Availability is a required field";
    }

    if (!validateRequiredStringField(bio)) {
        validationResults["bio"] = "Bio is a required field";
    }

    const tradeTypeSQL = "SELECT trade_type_id FROM trade_types";

    conn.query(tradeTypeSQL, (err, tradeTypeRows) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else {
            if (
                !validateRequiredNumberField(tradeType) ||
                !tradeTypeRows.some(
                    ({ trade_type_id }) => trade_type_id === tradeType,
                )
            ) {
                validationResults["tradeType"] = "Invalid Trade Type";
            }

            if (Object.keys(validationResults).length > 0) {
                res.status(400);
                res.json({
                    status: "failure",
                    validationResults,
                });
                return;
            }

            const updateSQL =
                "UPDATE traders SET trade_type_id = ?, region = ?, availability = ?, bio = ? WHERE trader_id = ?";

            conn.query(
                updateSQL,
                [tradeType, region, availability, bio, traderId],
                (err, rows) => {
                    if (err) {
                        res.status(500);
                        res.json({
                            status: "failure",
                            message: err,
                        });
                    } else {
                        if (rows.affectedRows > 0) {
                            res.status(200);
                            res.json({
                                status: "success",
                                message: `Record ID ${traderId} updated`,
                            });
                        } else {
                            res.status(404);
                            res.json({
                                status: "failure",
                                message: `Invalid ID ${traderId}`,
                            });
                        }
                    }
                },
            );
        }
    });
};

//#endregion

//#region Services

exports.getAllServicesForTrader = (req, res) => {
    const { traderId } = req.params;
    const selectSQL = `SELECT service_id, title, description, pricing_type, base_price FROM services WHERE trader_id = ?`;

    conn.query(selectSQL, [traderId], (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else {
            res.status(200);
            res.json({
                status: "success",
                message: `${rows.length} records retrieved`,
                result: rows,
            });
        }
    });
};

exports.getServiceForTrader = (req, res) => {
    const { traderId, serviceId } = req.params;
    const selectSQL = `SELECT service_id, title, description, pricing_type, base_price FROM services WHERE trader_id = ? AND service_id = ?`;

    conn.query(selectSQL, [traderId, serviceId], (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else if (rows.length === 0) {
            res.status(404);
            res.json({
                status: "failure",
                message: "Service does not exist",
            });
        } else {
            res.status(200);
            res.json({
                status: "success",
                message: `${rows.length} records retrieved`,
                result: rows,
            });
        }
    });
};

exports.putServiceForTrader = (req, res) => {
    const { traderId, serviceId } = req.params;
    const { title, description, pricingType, basePrice } = req.body;

    const validationResults = {};

    if (!validateRequiredStringField(title)) {
        validationResults["title"] = "Name is a required field";
    }

    if (!validateRequiredStringField(description)) {
        validationResults["description"] = "Description is a required field";
    }

    if (!validatePricingType(pricingType)) {
        validationResults["pricingType"] = "Pricing type is a required field";
    }

    if (!validateRequiredNumberField(basePrice)) {
        validationResults["basePrice"] = "Base price is a required field";
    }

    if (Object.keys(validationResults).length > 0) {
        res.status(400);
        res.json({
            status: "failure",
            validationResults,
        });
        return;
    }

    const updateSQL = `
    UPDATE services SET title = ?, description = ?, pricing_type = ?, base_price = ? WHERE trader_id = ? AND service_id = ?`;

    conn.query(
        updateSQL,
        [
            title,
            description,
            pricingType,
            basePrice.toFixed(2),
            traderId,
            serviceId,
        ],
        (err, rows) => {
            if (err) {
                res.status(500);
                res.json({
                    status: "failure",
                    message: err,
                });
            } else {
                if (rows.affectedRows > 0) {
                    res.status(200);
                    res.json({
                        status: "success",
                        message: `Record ID ${serviceId} updated`,
                    });
                } else {
                    res.status(404);
                    res.json({
                        status: "failure",
                        message: `Invalid ID ${serviceId}`,
                    });
                }
            }
        },
    );
};

exports.postServiceForTrader = (req, res) => {
    const { traderId } = req.params;
    const { title, description, pricingType, basePrice } = req.body;

    const validationResults = {};

    if (!validateRequiredStringField(title)) {
        validationResults["title"] = "Name is a required field";
    }

    if (!validateRequiredStringField(description)) {
        validationResults["description"] = "Description is a required field";
    }

    if (!validatePricingType(pricingType)) {
        validationResults["pricingType"] = "Pricing type is a required field";
    }

    //TODO: Something is probably wrong with this validation
    if (!validateRequiredNumberField(basePrice)) {
        validationResults["basePrice"] = "Base price is a required field";
    }

    if (Object.keys(validationResults).length > 0) {
        res.status(400);
        res.json({
            status: "failure",
            validationResults,
        });
        return;
    }

    const insertSQL = `INSERT INTO services (title, description, pricing_type, base_price, trader_id)
            VALUES (?, ?, ?, ?, ?)`;

    conn.query(
        insertSQL,
        [title, description, pricingType, basePrice.toFixed(2), traderId],
        (err, rows) => {
            if (err) {
                res.status(500);
                res.json({
                    status: "failure",
                    message: err,
                });
            } else {
                res.status(201);
                res.json({
                    status: "success",
                    message: `Record ID ${rows.insertId} added`,
                });
            }
        },
    );
};

exports.deleteServiceForTrader = (req, res) => {
    const { traderId, serviceId } = req.params;

    const deleteSQL = `DELETE FROM services WHERE trader_id = ? AND service_id = ?`;

    conn.query(deleteSQL, [traderId, serviceId], (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else {
            if (rows.affectedRows > 0) {
                res.status(200);
                res.json({
                    status: "success",
                    message: `Record ID ${serviceId} deleted`,
                });
            } else {
                res.status(404);
                res.json({
                    status: "failure",
                    message: `Invalid ID ${serviceId}`,
                });
            }
        }
    });
};

//#endregion
