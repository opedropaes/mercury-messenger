const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').authServices;

router.get('/', (req, res) => {
	res.render('index.html');
});

router.post('/registrar', authController.register);

router.post('/entrar', authController.login);

module.exports = router;