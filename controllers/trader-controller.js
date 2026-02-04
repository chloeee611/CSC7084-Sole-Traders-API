const conn = require("../utils/dbconn");
const { validateDateTime, validateEmail } = require("../utils/validators");

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

    //TODO: Validate tradeType

    if (!validateRequiredStringField(region)) {
        res.status(400);
        res.json({
            status: "failure",
            message: "Please enter your region",
        });
        return;
    }

    if (!validateRequiredStringField(availability)) {
        res.status(400);
        res.json({
            status: "failure",
            message: "Please enter your availability",
        });
        return;
    }

    if (!validateRequiredStringField(bio)) {
        res.status(400);
        res.json({
            status: "failure",
            message: "Please enter your bio",
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

    const updateSQL = `
    UPDATE services SET title = ?, description = ?, pricing_type = ?, base_price = ? WHERE trader_id = ? AND service_id = ?`;

    conn.query(
        updateSQL,
        [title, description, pricingType, basePrice, traderId, serviceId],
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

    const insertSQL = `INSERT INTO services (title, description, pricing_type, base_price, trader_id)
            VALUES (?, ?, ?, ?, ?)`;

    conn.query(
        insertSQL,
        [title, description, pricingType, basePrice, traderId],
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
