const conn = require("../utils/dbconn");
const {
    validateDateTime,
    validateEmail,
    validateStatus,
} = require("../utils/validators");

exports.getAllBookings = (req, res) => {
    const selectSQL = `SELECT * FROM bookings`;

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

exports.getBooking = (req, res) => {
    const { bookingId } = req.params;

    const selectSQL = `        
        SELECT * 
        FROM bookings 
        WHERE booking_id = ${bookingId}
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

exports.postBooking = (req, res) => {
    console.log(req.body);
    const {
        clientName,
        clientEmailAddress,
        serviceId,
        requestedDateTime,
        jobDescription,
        status,
    } = req.body;

    if (!validateEmail(clientEmailAddress)) {
        res.status(400);
        res.json({
            status: "failure",
            message: "Invalid email format",
        });
        return;
    }

    console.log(validateEmail(clientEmailAddress));

    if (!validateDateTime(requestedDateTime)) {
        res.status(400);
        res.json({
            status: "failure",
            message: "Invalid date and time format",
        });
        return;
    }

    if (!validateStatus(status)) {
        res.status(400);
        res.json({
            status: "failure",
            message: "Invalid status",
        });
        return;
    }

    const insertSQL = `INSERT INTO bookings (client_name, client_email_address, service_id, requested_date_time, job_description, status)
            VALUES (?, ?, ?, ?, ?, ?)`;

    conn.query(
        insertSQL,
        [
            clientName,
            clientEmailAddress,
            serviceId,
            requestedDateTime,
            jobDescription,
            status,
        ],
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
                    message: `Record created`,
                });
            }
        },
    );
};

exports.putBooking = (req, res) => {
    const { bookingId } = req.params;
    const {
        clientName,
        clientEmailAddress,
        serviceId,
        requestedDate,
        requestedStartTime,
        jobDescription,
        status,
    } = req.body;

    if (!validateStatus(status)) {
        res.status(400);
        res.json({
            status: "failure",
            message: "Invalid status",
        });
        return;
    }

    const updateSQL = `
        UPDATE bookings 
        SET client_name = ?, client_email_address = ?, service_id = ?, requested_date = ?, requested_start_time = ?, job_description = ?, status = ? 
        WHERE booking_id = ?
    `;

    conn.query(
        updateSQL,
        [
            clientName,
            clientEmailAddress,
            serviceId,
            requestedDate,
            requestedStartTime,
            jobDescription,
            status,
            bookingId,
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
                    res.status(201);
                    res.json({
                        status: "success",
                        message: `Record ID ${bookingId} updated`,
                    });
                } else {
                    res.status(404);
                    res.json({
                        status: "failure",
                        message: `Invalid ID ${bookingId}`,
                    });
                }
            }
        },
    );
};

exports.patchBookingStatus = (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!validateStatus(status)) {
        res.status(400);
        res.json({
            status: "failure",
            message: "Invalid status",
        });
        return;
    }

    const updateSQL = `UPDATE bookings SET status = ? WHERE booking_id = ?`;

    conn.query(updateSQL, [status, bookingId], (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else {
            if (rows.affectedRows > 0) {
                res.status(204);
                res.json({
                    status: "success",
                    message: `Record ID ${bookingId} updated`,
                });
            } else {
                res.status(404);
                res.json({
                    status: "failure",
                    message: `Invalid ID ${bookingId}`,
                });
            }
        }
    });
};

exports.deleteBooking = (req, res) => {
    const { bookingId } = req.params;

    const deleteSQL = `DELETE FROM bookings WHERE booking_id = ?`;

    conn.query(deleteSQL, [bookingId], (err, rows) => {
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
                    message: `Record ID ${bookingId} deleted`,
                });
            } else {
                res.status(404);
                res.json({
                    status: "failure",
                    message: `Invalid ID ${bookingId}`,
                });
            }
        }
    });
};
