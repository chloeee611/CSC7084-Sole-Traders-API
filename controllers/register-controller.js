const conn = require("../utils/dbconn");
const bcrypt = require("bcrypt");
const {
    validatePassword,
    validateRequiredStringField,
    validateUsername,
    validateEmail,
} = require("../utils/validators");
const SALT_WORK_FACTOR = 10;

exports.postRegister = (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body;

    const validationResults = {};

    if (!validateRequiredStringField(name)) {
        validationResults["name"] = "Name is a required field";
    }

    if (!validateUsername(username)) {
        validationResults["username"] =
            "Username must be at least 4 characters long";
    }

    if (!validateEmail(email)) {
        validationResults["email"] = "Invalid email format";
    }

    if (!validatePassword(password)) {
        validationResults["password"] =
            "Password must have 8 characters, one uppercase, one lowercase, one number, one special character";
    }

    if (!validateRequiredStringField(name) || password !== confirmPassword) {
        validationResults["confirmPassword"] = "Passwords do not match";
    }

    if (Object.keys(validationResults).length > 0) {
        res.status(400);
        res.json({
            status: "failure",
            validationResults,
        });
        return;
    }

    const selectUsernameSQL = `SELECT * FROM traders WHERE username = ?`;

    conn.query(selectUsernameSQL, [username], (err, usernameRows) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else {
            if (usernameRows.length > 0) {
                res.status(400);
                res.json({
                    status: "failure",
                    message: "Username already in use",
                });

                return;
            }

            const selectEmailSQL = `SELECT * FROM traders WHERE email = ?`;

            conn.query(selectEmailSQL, [email], (err, emailRows) => {
                if (err) {
                    res.status(500);
                    res.json({
                        status: "failure",
                        message: err,
                    });
                } else {
                    if (emailRows.length > 0) {
                        res.status(400);
                        res.json({
                            status: "failure",
                            message: "Email already in use",
                        });

                        return;
                    }

                    bcrypt.hash(
                        password,
                        SALT_WORK_FACTOR,
                        (err, hashedPassword) => {
                            const insertSQL = `INSERT INTO traders (name, username, email, password, trade_type_id, region, availability, bio)
            VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL)`;

                            conn.query(
                                insertSQL,
                                [
                                    name,
                                    username,
                                    email.toLowerCase(),
                                    hashedPassword,
                                ],
                                (err) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        res.status(201);
                                        res.json({
                                            message:
                                                "Trader successfully registered",
                                        });
                                    }
                                },
                            );
                        },
                    );
                }
            });
        }
    });
};
