const conn = require("../utils/dbconn");

exports.getTradeTypes = (req, res) => {
    const selectTraderTypeSQL = "SELECT * FROM trade_types";

    conn.query(selectTraderTypeSQL, (err, rows) => {
        if (err) {
            throw err;
        }

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
