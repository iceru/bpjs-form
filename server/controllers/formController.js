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
    const queryInsert = "INSERT INTO form_id_type (form_id, form_type_id, label) VALUES (?, ?, ?)";
    const queryColumns = `
        SELECT COLUMN_NAME, DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
    `;

    const updateForm = () => {
        return new Promise((resolve, reject) => {
            db.query(query, [bg_color, border_color, table, id], (err, results) => {
                if (err) return reject(err);
                resolve();
            });
        });
    };

    const getColumns = () => {
        return new Promise((resolve, reject) => {
            db.query(queryColumns, ['formgenerator', table], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    };

    const getFormTypes = () => {
        return new Promise((resolve, reject) => {
            db.query(queryForm, (err, resForm) => {
                if (err) return reject(err);
                resolve(resForm);
            });
        });
    };

    const insertFormType = (formId, formTypeId, label) => {
        return new Promise((resolve, reject) => {
            db.query(queryInsert, [formId, formTypeId, label], (err, results) => {
                if (err) return reject(err);
                resolve();
            });
        });
    };

    const processForm = async () => {
        try {
            await updateForm();

            const columns = await getColumns();
            if (columns.length > 0) {
                const formTypes = await getFormTypes();

                for (const column of columns) {
                    for (const form of formTypes) {
                        if (form.type === mappingTypes(column.COLUMN_NAME, column.DATA_TYPE)) {
                            await insertFormType(id, form.id, column.COLUMN_NAME);
                        }
                    }
                }
            }

            return res.status(201).json({ message: "Form updated successfully." });
        } catch (error) {
            console.error('Error processing form:', error);
            return res.status(500).json({ error: 'An error occurred during form processing.' });
        }
    };

    processForm();
};

exports.getGeneratedForm = (req, res) => {
    const { id } = req.body;
    const queryUser = "SELECT form_id FROM users WHERE id = ?"
    const query = `
    SELECT 
      form_types.type, 
      form_types.form_type, 
      form.id, 
      form_id_type.label,
      form.bg_color, 
      form.table,
      form.border_color 
    FROM 
      form_id_type 
    JOIN 
      form ON form.id = form_id_type.form_id 
    JOIN 
      form_types ON form_types.id = form_id_type.form_type_id 
    WHERE 
      form_id_type.form_id = ?;
  `;

    db.query(queryUser, [id], (err, results) => {
        if (err) throw err;
        const formId = results[0];

        db.query(query, [formId.form_id], (err, results) => {
            if (err) throw err;
            res.json(results)
        })
    })
}