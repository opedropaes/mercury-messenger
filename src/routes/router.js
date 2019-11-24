const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').authServices;
const contactController = require('../controllers/contactsController').contactServices;
const communicatorController = require('../controllers/communicatorController').communicatorServices;

router.get('/', (req, res) => {
    res.send('mercury-messenger');
});

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

router.delete('/excluir', authController.delete);

router.get('/pessoas', authServices.list);

// Contatos

router.post('/adicionar-contato', contactServices.addContact);

router.delete('/remover-contato', contactServices.removeContact);

// User

router.get('/:username/listar-contatos', communicatorServices.getContacts);


module.exports = router;