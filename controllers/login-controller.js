const conn = require("../utils/dbconn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    const vals = { username };
    const checkuserSQL = `SELECT * FROM traders WHERE username = :username`;

    const validationResults = {};

    conn.query(checkuserSQL, vals, (err, rows) => {
        if (err) throw err;

        const numrows = rows.length;

        if (numrows === 0) {
            validationResults["username"] = "Username is not in use";
            res.status(400);
            res.json({
                status: "failure",
                validationResults,
            });
            return;
        }

        const trader = rows[0];

        bcrypt.compare(password, trader.password, (err2, match) => {
            if (err2) {
                console.log(err);
                res.status(500);
                res.json({
                    message: err2,
                });
                return;
            }

            // Password incorrect
            if (!match) {
                validationResults["password"] = "Password is incorrect";
                res.status(400);
                res.json({
                    status: "failure",
                    validationResults,
                });
                return;
            }

            // Password correct
            let token;

            try {
                token = jwt.sign(
                    {
                        id: trader.trader_id,
                        email: trader.email,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" },
                );
            } catch (err2) {
                console.log(err);
                res.status(500);
                res.json({
                    message: err2,
                });
                return;
            }

            res.status(200);
            res.json({
                traderId: trader.trader_id,
                token,
            });
        });
    });
};
