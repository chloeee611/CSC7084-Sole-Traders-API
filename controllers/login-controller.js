const conn = require("../utils/dbconn");
const bcrypt = require("bcrypt");

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    const vals = [username];
    const checkuserSQL = `SELECT * FROM traders WHERE username = ?`;

    conn.query(checkuserSQL, vals, (err, rows) => {
        if (err) throw err;

        const numrows = rows.length;

        if (numrows === 0) {
            res.status(401);
            res.json({
                message: "Invalid login credentials",
            });
            return;
        }

        const trader = rows[0];

        bcrypt.compare(password, trader.password, (err2, match) => {
            if (err2) {
                res.status(500);
                res.json({
                    message: err2,
                });
                return;
            }

            // Password incorrect
            if (!match) {
                res.status(401);
                res.json({
                    message: "Invalid login credentials",
                });
                return;
            }

            // Password correct
            res.status(200);
            res.json({
                traderId: trader.trader_id,
            });
        });
    });
};
