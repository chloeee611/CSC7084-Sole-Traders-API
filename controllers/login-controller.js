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
            return res.redirect("/trader-login");
        }

        const trader = rows[0];

        console.log(trader);

        bcrypt.compare(password, trader.password, (err2, match) => {
            if (err2) {
                console.error(err2);
                return res.redirect("/trader-login");
            }

            // Password incorrect
            if (!match) {
                return res.redirect("/trader-login");
            }

            // Password correct
            req.session.isloggedin = true;
            req.session.traderId = trader.trader_id;
            res.redirect("/trader-profile");
        });
    });
};
