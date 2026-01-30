const conn = require("../utils/dbconn");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

exports.postRegister = (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        res.status(400);
        res.json({
            message: "Passwords do not match",
        });
        return;
    }

    bcrypt.hash(password, SALT_WORK_FACTOR, (err, hashedPassword) => {
        const insertSQL = `INSERT INTO traders (name, username, email, password, trade_type_id, region, availability, bio)
            VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL)`;

        conn.query(
            insertSQL,
            [name, username, email.toLowerCase(), hashedPassword],
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    res.status(201);
                    res.json({
                        message: "Trader successfully registered",
                    });
                }
            },
        );
    });
};
