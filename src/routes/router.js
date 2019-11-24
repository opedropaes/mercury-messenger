const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').authServices;
const contactController = require('../controllers/contactsController').contactServices;
const communicatorController = require('../controllers/communicatorController').communicatorServices;

router.get('/', (req, res) => {
    res.send('mercury-messenger');
});

<<<<<<< HEAD
router.post('/registrar', async(req, res) => {
    let isRegistered = false
    authController.register(req, res)
        .then(response => {
            console.log(response)
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
=======
// Autenticacao

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
>>>>>>> ba14fad1c1c12263d3decbb1149b3f75d8bc8773
});

router.post('/entrar', async(req, res) => {
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

// Contatos

router.post('/adicionar-contato', contactController.addContact);

router.delete('/remover-contato', contactController.removeContact);

// User

router.get('/pessoas', communicatorController.listAllCommunicators);

router.get('/:username/listar-contatos', communicatorController.getContacts);

router.post('/:username/configurar-conta', async (req, res) => {
	const { username } = req.params;
	const { newName, newEmail } = req.body;
	const payload = { username, newName, newEmail };

	communicatorController.updateAccout(payload)
		.then(response => {
			if (response.ok == 1) {
				res.status(200).send(response);
			} else {
				res.status(400).send(response);
			}
		})
		.catch(err => {
			console.log(err)
			res.status(500).send(err);
		});
});

router.delete('/:username/deletar-conta', async (req, res) => {
	const { username } = req.params;
	communicatorController.deleteAccount(username)
		.then(response => {
			if (response.ok == 1) {
				res.status(200).send(response);
			} else {
				res.status(400).send(response);
			}
		})
		.catch(err => {
			console.log(err)
			res.status(500).send(err);
		});
});


module.exports = router;