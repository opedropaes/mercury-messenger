const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/cadastro', function(req, res, next) {
    res.render('register');
});

router.get('/conversas', function(req, res, next) {
    res.render('chat');
});

module.exports = router;