const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').authServices;

router.get('/', (req, res) => {
	res.render('index.html');
});

router.post('/registrar', async (req, res) => {
	let isRegistered = false
	authController.register(req, res)
		.then(response => {
			isRegistered = response.communicator.id;
			if (isRegistered) {
				res.redirect('http://localhost:5500/chat.html?username=' + response.communicator.username); //trocar com handleRegiter
			} else {
				res.redirect('http://localhost:5500/register.html');
			}
		})
		.catch(err => {
			console.log(err);
		});
});

router.post('/entrar', async (req, res) => {
	let isLoginValid = false 
	authController.login(req, res)
		.then(response => {
			try {
				isLoginValid = response.communicator;
				if (isLoginValid) {
					res.status(200).json({username: response.communicator.username, token: response.token});
				} else {
					res.status(400).send(response);
				}
			} catch (error) {
				console.log("error from catch: ", error);
				res.status(404).send(response);
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