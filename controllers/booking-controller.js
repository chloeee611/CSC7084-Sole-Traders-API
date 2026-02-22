const conn = require("../utils/dbconn");
const {
    validateBookingDate,
    validateRequiredStringField,
    validateEmail,
    validateStatus,
} = require("../utils/validators");

exports.getAllBookings = (req, res) => {
    const { status, order_by, order_direction } = req.query;

    let selectSQL = `SELECT * FROM bookings`;

    if (status) {
        selectSQL += `\nWHERE status LIKE :status`;
    }

    if (order_by) {
        // Would be nice to validate order_by is a valid column
        selectSQL += `\nORDER BY ${order_by} ${!order_direction || order_direction.toLowerCase() === "asc" ? "ASC" : "DESC"}`;
    }

    conn.query(selectSQL, { status }, (err, rows) => {
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

exports.getBooking = (req, res) => {
    const { bookingId } = req.params;

    const selectSQL = `        
        SELECT * 
        FROM bookings 
        WHERE booking_id = :bookingId
        `;

    conn.query(selectSQL, { bookingId }, (err, rows) => {
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
                result: rows[0],
            });
        }
    });
};

exports.postBooking = (req, res) => {
    const {
        clientName,
        clientEmailAddress,
        serviceId,
        requestedDateTime,
        jobDescription,
        status,
    } = req.body;

    const validationResults = {};

    if (!validateRequiredStringField(clientName)) {
        validationResults["clientName"] = "Name is a required field";
    }

    if (!validateEmail(clientEmailAddress)) {
        validationResults["clientEmailAddress"] = "Invalid email format";
    }

    if (!validateBookingDate(requestedDateTime)) {
        validationResults["requestedDateTime"] = "Invalid date and time format";
    }

    if (!validateRequiredStringField(jobDescription)) {
        validationResults["jobDescription"] = "Description is a required field";
    }

    if (Object.keys(validationResults).length > 0) {
        res.status(400);
        res.json({
            status: "failure",
            validationResults,
        });
        return;
    }

    const insertSQL = `INSERT INTO bookings (client_name, client_email_address, service_id, requested_date_time, job_description, status)
            VALUES (:clientName, :clientEmailAddress, :serviceId, :requestedDateTime, :jobDescription, :status)`;

    conn.query(
        insertSQL,
        {
            clientName,
            clientEmailAddress,
            serviceId,
            requestedDateTime,
            jobDescription,
            status,
        },
        (err) => {
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
        requestedDateTime,
        jobDescription,
        status,
    } = req.body;

    const validationResults = {};

    if (!validateRequiredStringField(clientName)) {
        validationResults["clientName"] = "Name is a required field";
    }

    if (!validateEmail(clientEmailAddress)) {
        validationResults["clientEmailAddress"] = "Invalid email format";
    }

    if (!validateBookingDate(requestedDateTime)) {
        validationResults["requestedDateTime"] = "Invalid date and time format";
    }

    if (!validateRequiredStringField(jobDescription)) {
        validationResults["jobDescription"] = "Description is a required field";
    }

    if (!validateStatus(status)) {
        validationResults["status"] = "Status is a required field";
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
        UPDATE bookings 
        SET client_name = :clientName, client_email_address = :clientEmailAddress, service_id = :serviceId, requested_date_time = :requestedDateTime, job_description = :jobDescription, status = :status 
        WHERE booking_id = :bookingId
    `;

    conn.query(
        updateSQL,
        {
            clientName,
            clientEmailAddress,
            serviceId,
            requestedDateTime,
            jobDescription,
            status,
            bookingId,
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

    const validationResults = {};

    if (!validateStatus(status)) {
        validationResults["status"] = "Status is a required field";
    }

    if (Object.keys(validationResults).length > 0) {
        res.status(400);
        res.json({
            status: "failure",
            validationResults,
        });
        return;
    }

    const updateSQL = `UPDATE bookings SET status = :status WHERE booking_id = :bookingId`;

    conn.query(updateSQL, { status, bookingId }, (err, rows) => {
        if (err) {
            console.log(err);
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

    const deleteSQL = `DELETE FROM bookings WHERE booking_id = :bookingId`;

    conn.query(deleteSQL, { bookingId }, (err, rows) => {
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
