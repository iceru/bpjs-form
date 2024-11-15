const db = require("../db");
const { insertFormTypeId } = require("../helper/getFormType");

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


const mappingTypes = (name, type) => {
    const data = "text"
    switch (type) {
        case 'VARCHAR':
            data = "text"
            switch (name) {
                case "email":
                    data = "email"
                    break;
                case "phone":
                    data = "tel"
                    break;
                default:
                    break;
            }
            break;
        case 'TEXT':
            data = "textarea"
            break;
        default:
            break;
    }

    return data;
}

exports.setForm = (req, res) => {
    const { bg_color, border_color, table, id } = req.body;

    const query = "UPDATE form SET bg_color = ?, border_color = ?, `table` = ? WHERE id = ?";
    const queryForm = "SELECT * FROM form_types";
    const queryInsert = "INSERT INTO form_id_type (form_id, form_type_id) VALUES (?, ?)"
    const queryColumns = `
    SELECT COLUMN_NAME, DATA_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
  `;

    db.query(query, [bg_color, border_color, table, id], (err, results) => {
        if (err) throw err;
    });

    db.query(queryColumns, ['formgenerator', table], (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            db.query(queryForm, (err, resForm) => {
                if (err) throw err;
                results.forEach((item) => {
                    resForm.forEach((form) => {
                        console.log(form.type);
                        console.log(mappingTypes(item.COLUMN_NAME, item.DATA_TYPE))
                        if (form.type === mappingTypes(item.COLUMN_NAME, item.DATA_TYPE)) {
                            db.query(queryInsert, [id, form.id], (err, results) => {
                                if (err) throw err;
                                return res.status(201)
                            })
                        }
                    })
                })
            });
        }
        return res.status(201)

    })
}