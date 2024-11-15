const db = require("../db");

exports.getForms = (req, res) => {
    const query = "SELECT * FROM form";

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    })
}

exports.getFormById = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM form WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
}

exports.getTable = (req, res) => {
    const query = "SHOW TABLES";
    db.query(query, (err, results) => {
        if (err) throw err;
        const tableNames = results.filter((row) => !Object.values(row)[0].includes('form'))
            .map((row) => Object.values(row)[0]);
        res.json(tableNames)
    })
}