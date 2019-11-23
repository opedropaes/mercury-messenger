const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').authServices;
const contactController = require('../controllers/contactsController').contactServices;
const communicatorController = require('../controllers/communicatorController').communicatorServices;

router.get('/', (req, res) => {
	res.render('index.html');
});

router.post('/registrar', async (req, res) => {
	let isRegistered = false
	authController.register(req, res)
		.then(response => {
			const { communicator, token } = response;
			isRegistered = communicator.id;

			if (isRegistered) {
				res.status(200).json({ communicator, token });
			} else {
				res.status(400).send(communicator);
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

					const { communicator, token } = response;
					const { username } = communicator;
					res.status(200).json({ username, token });
				
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

// Contatos

router.post('/adicionar-contato', contactServices.addContact);

router.delete('/remover-contato', contactServices.removeContact);

// User

router.get('/:username/listar-contatos', communicatorServices.getContacts);


// Não-definitivo
router.get('/:username/contatos', (req, res) => {
	authServices.list(req, res)
		.then(response => {
			let users = response.filter(user => user.username != req.params.username);
			res.status(200).send({users});
		})
})

module.exports = router;