const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').authServices;

router.get('/', (req, res) => {
	res.render('index.html');
});

router.post('/registrar', authController.register);

router.post('/entrar', async (req, res) => {
	let isLoginValid = false 
	authController.login(req, res)
		.then(response => {
			isLoginValid = response.communicator.id;
			if (isLoginValid) {
				// res.render('contatos.html');
				res.redirect('chat.html');
			} else {
				res.redirect('index.html');
			}
		})
		.catch(err => {
			console.log(err);
		});
});

router.delete('/excluir', authController.delete);

router.get('/listar', authServices.list);

// Não-definitivo
router.get('/:username/contatos', (req, res) => {
	authServices.list(req, res)
		.then(response => {
			let users = response.filter(user => user.username != req.params.username);
			res.status(200).send({users});
		})
})

module.exports = router;