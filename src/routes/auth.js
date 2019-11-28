const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').authServices;

router.post('/registrar', async(req, res) => {

    if (!req.body.email || !req.body.password || !req.body.username || !req.body.name) {
        return res.status(422);
    }

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
            res.status(422);
        });
});

router.post('/entrar', async(req, res) => {

    if (!req.body.password || !req.body.username) {
        return res.status(422);
    }

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

module.exports = router;