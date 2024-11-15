const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const formController = require("../controllers/formController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get('/users', verifyToken, userController.getUsers);
router.get('/forms', verifyToken, formController.getForms);
router.get('/form/:id', verifyToken, formController.getFormById);
router.get('/tables', verifyToken, formController.getTable);
router.post('/set-tables', verifyToken, formController.setForm);


module.exports = router;
