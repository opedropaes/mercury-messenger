const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').authServices;

router.get('/', (req, res) => {
	res.render('index.html');
});

router.post('/registrar', authController.register);

router.post('/entrar', authController.login);

router.delete('/excluir', authController.delete);

router.get('/listar', authServices.list);

module.exports = router;