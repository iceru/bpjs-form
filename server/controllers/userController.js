const db = require("../db");

exports.getUsers = (req, res) => {
    const query = "SELECT * FROM users";

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    })
}

exports.updateUsers = (req, res) => {
    const { id, formId } = req.body;

    // Check if required fields are present
    if (!id || !formId) {
        return res.status(400).json({ error: 'ID and Form ID are required.' });
    }

    const query = "UPDATE users SET form_id = ? WHERE id = ?";

    db.query(query, [formId, id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database update failed.' });
        }

        // Check if the update was successful
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User updated successfully.', data: results });
    });
}
