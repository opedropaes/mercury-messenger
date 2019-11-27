const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactsController').contactServices;
const communicatorController = require('../controllers/communicatorController').communicatorServices;

router.post('/adicionar-contato', contactController.addContact);

router.delete('/remover-contato', contactController.removeContact);

router.get('/pessoas', communicatorController.listAllCommunicators);

router.get('/:username/listar-contatos', communicatorController.getContacts);

router.post('/:username/configurar-conta', async(req, res) => {
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

router.delete('/:username/deletar-conta', async(req, res) => {
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