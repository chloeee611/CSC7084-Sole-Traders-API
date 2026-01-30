const conn = require("../utils/dbconn");

exports.getAllServices = (req, res) => {
    const selectSQL = `SELECT service_id, title, description, pricing_type, base_price, trader_id FROM services`;

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

exports.getService = (req, res) => {
    const { serviceId } = req.params;

    const selectSQL = `        
        SELECT * 
        FROM services 
        WHERE service_id = ${serviceId}
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

exports.postService = (req, res) => {
    const { traderId } = req.params;
    const { title, description, pricingType, basePrice } = req.body;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    const insertSQL = `INSERT INTO services (title, description, pricing_type, base_price, trader_id)
            VALUES (?, ?, ?, ?, ?)`;

    conn.query(
        insertSQL,
        [title, description, pricingType, basePrice, traderId],
        (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.redirect(`/trader-services`);
            }
        },
    );
};

exports.putService = (req, res) => {
    const { serviceId } = req.params;
    const { title, description, pricingType, basePrice } = req.body;

    const updateSQL = `
    UPDATE services SET title = ?, description = ?, pricing_type = ?, base_price = ? AND service_id = ?`;

    conn.query(
        updateSQL,
        [title, description, pricingType, basePrice, serviceId],
        (err, rows) => {
            if (err) {
                res.status(500);
                res.json({
                    status: "failure",
                    message: err,
                });
            } else {
                if (rows.affectedRows > 0) {
                    res.status(201);
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

exports.deleteService = (req, res) => {
    const { serviceId } = req.params;

    const deleteSQL = `DELETE FROM services WHERE service_id = ?`;

    conn.query(deleteSQL, [serviceId], (err, rows) => {
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
