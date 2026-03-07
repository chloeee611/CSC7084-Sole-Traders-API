const conn = require("../utils/dbconn");
const {
    validateRequiredStringField,
    validateRequiredNumberField,
    validateTraderRating,
} = require("../utils/validators");
const { validationResult } = require("express-validator");

//#region Trader

exports.getAllTraders = (req, res) => {
    const { region, trade_type, order_by, order_direction } = req.query;

    let selectSQL = `
        SELECT traders.trader_id, name, username, email, traders.trade_type_id, region, availability, bio, trade_type_name, AVG(rating) as average_rating
        FROM traders 
        LEFT JOIN ratings
        ON traders.trader_id = ratings.trader_id
        LEFT JOIN trade_types
        ON traders.trade_type_id = trade_types.trade_type_id
        GROUP BY traders.trader_id
        `;

    if (region && trade_type !== undefined && trade_type !== "") {
        selectSQL += `\nHAVING region LIKE :region AND traders.trade_type_id = :trade_type`;
    } else if (trade_type !== undefined && trade_type !== "") {
        selectSQL += `\nHAVING traders.trade_type_id = :trade_type`;
    } else if (region) {
        selectSQL += `\nHAVING region LIKE :region`;
    }

    if (order_by) {
        selectSQL += `\nORDER BY ${order_by} ${!order_direction || order_direction.toLowerCase() === "asc" ? "ASC" : "DESC"}`;
    }

    conn.query(
        selectSQL,
        {
            region: `${region}%`,
            trade_type,
        },
        (err, rows) => {
            if (err) {
                console.log(err);
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
        },
    );
};

exports.getTrader = (req, res) => {
    const { traderId } = req.params;

    let selectSQL = `
        SELECT traders.trader_id, name, username, email, traders.trade_type_id, region, availability, bio, trade_type_name, AVG(rating) as average_rating
        FROM traders 
        LEFT JOIN ratings
        ON traders.trader_id = ratings.trader_id
        LEFT JOIN trade_types
        ON traders.trade_type_id = trade_types.trade_type_id
        WHERE traders.trader_id = :traderId
        GROUP BY traders.trader_id
        `;

    conn.query(selectSQL, { traderId }, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else if (rows.length === 0) {
            console.log(err);
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
            console.log(err);
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else {
            const tradeTypeId = Number(tradeType);

            if (
                !validateRequiredNumberField(tradeTypeId) ||
                !tradeTypeRows.some(
                    ({ trade_type_id }) => trade_type_id === tradeTypeId,
                )
            ) {
                validationResults.tradeType = "Invalid Trade Type";
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
                "UPDATE traders SET trade_type_id = :tradeType, region = :region, availability = :availability, bio = :bio WHERE trader_id = :traderId";

            conn.query(
                updateSQL,
                { tradeType, region, availability, bio, traderId },
                (err, rows) => {
                    if (err) {
                        console.log(err);
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
    const selectSQL = `SELECT service_id, title, description, pricing_type, base_price FROM services WHERE trader_id = :traderId`;

    conn.query(selectSQL, { traderId }, (err, rows) => {
        if (err) {
            console.log(err);
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
    const selectSQL = `SELECT service_id, title, description, pricing_type, base_price FROM services WHERE trader_id = :traderId AND service_id = :serviceId`;

    conn.query(selectSQL, { traderId, serviceId }, (err, rows) => {
        if (err) {
            console.log(err);
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
                result: rows[0],
            });
        }
    });
};

exports.putServiceForTrader = (req, res) => {
    const { traderId, serviceId } = req.params;
    const { title, description, pricingType, basePrice } = req.body;

    const { errors } = validationResult(req);

    if (errors.length > 0) {
        res.status(400);
        res.json({
            status: "failure",
            validationResults: Object.fromEntries(
                errors.map(({ path, msg }) => [path, msg]),
            ),
        });
        return;
    }
    const updateSQL = `
    UPDATE services SET title = :title, description = :description, pricing_type = :pricingType, base_price = :basePrice WHERE trader_id = :traderId AND service_id = :serviceId`;

    conn.query(
        updateSQL,

        {
            title,
            description,
            pricingType,
            basePrice: Number(basePrice).toFixed(2),
            traderId,
            serviceId,
        },
        (err, rows) => {
            if (err) {
                console.log(err);
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

    const { errors } = validationResult(req);

    if (errors.length > 0) {
        console.log(errors);
        res.status(400);
        res.json({
            status: "failure",
            validationResults: Object.fromEntries(
                errors.map(({ path, msg }) => [path, msg]),
            ),
        });
        return;
    }

    const insertSQL = `INSERT INTO services (title, description, pricing_type, base_price, trader_id)
            VALUES (:title, :description, :pricingType, :basePrice, :traderId)`;

    conn.query(
        insertSQL,
        {
            title,
            description,
            pricingType,
            basePrice: Number(basePrice).toFixed(2),
            traderId,
        },
        (err, rows) => {
            if (err) {
                console.log(err);
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

    const deleteSQL = `DELETE FROM services WHERE trader_id = :traderId AND service_id = :serviceId`;

    conn.query(deleteSQL, { traderId, serviceId }, (err, rows) => {
        if (err) {
            console.log(err);
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

//#region Ratings

exports.getAllRatingsForTrader = (req, res) => {
    const { traderId } = req.params;
    const selectSQL = `SELECT rating_id, trader_id, rating as average_rating FROM ratings WHERE trader_id = :traderId`;

    conn.query(selectSQL, { traderId }, (err, rows) => {
        if (err) {
            console.log(err);
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

exports.getRatingForTrader = (req, res) => {
    const { traderId, ratingId } = req.params;
    const selectSQL = `SELECT rating_id, trader_id, rating FROM ratings WHERE trader_id = :traderId AND rating_id = :ratingId`;

    conn.query(selectSQL, { traderId, ratingId }, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else if (rows.length === 0) {
            res.status(404);
            res.json({
                status: "failure",
                message: "Rating does not exist",
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

exports.putRatingForTrader = (req, res) => {
    const { traderId, ratingId } = req.params;
    const { rating } = req.body;

    const validationResults = {};

    if (!validateTraderRating(rating)) {
        validationResults["rating"] = "Rating must be a number between 1 and 5";
    }

    if (Object.keys(validationResults).length > 0) {
        res.status(400);
        res.json({
            status: "failure",
            validationResults,
        });
        return;
    }

    const updateSQL = `UPDATE ratings SET rating = :rating WHERE trader_id = :traderId AND rating_id = :ratingId`;

    conn.query(updateSQL, { rating, traderId, ratingId }, (err, rows) => {
        if (err) {
            console.log(err);
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
                    message: `Record ID ${ratingId} updated`,
                });
            } else {
                res.status(404);
                res.json({
                    status: "failure",
                    message: `Invalid ID ${ratingId}`,
                });
            }
        }
    });
};

exports.postRatingForTrader = (req, res) => {
    const { traderId } = req.params;
    const { rating } = req.body;

    const validationResults = {};

    if (!validateTraderRating(rating)) {
        validationResults["rating"] = "Rating must be a number between 1 and 5";
    }

    if (Object.keys(validationResults).length > 0) {
        res.status(400);
        res.json({
            status: "failure",
            validationResults,
        });
        return;
    }

    const insertSQL = `INSERT INTO ratings (rating, trader_id)
            VALUES (:rating, :traderId)`;

    conn.query(insertSQL, { rating, traderId }, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else {
            res.status(201);
            res.json({
                status: "success",
                id: rows.insertId,
                message: `Record ID ${rows.insertId} added`,
            });
        }
    });
};

exports.deleteRatingForTrader = (req, res) => {
    const { traderId, ratingId } = req.params;

    const deleteSQL = `DELETE FROM ratings WHERE trader_id = :traderId AND rating_id = :ratingId`;

    conn.query(deleteSQL, { traderId, ratingId }, (err, rows) => {
        if (err) {
            console.log(err);
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
                    message: `Record ID ${ratingId} deleted`,
                });
            } else {
                res.status(404);
                res.json({
                    status: "failure",
                    message: `Invalid ID ${ratingId}`,
                });
            }
        }
    });
};

//#endregion
