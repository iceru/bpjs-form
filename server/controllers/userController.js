const db = require("../db");

exports.getUsers = (req, res) => {
    const query = "SELECT * FROM users";

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    })
}