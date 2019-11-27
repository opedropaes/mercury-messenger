const app = require('./config/server').app;
const path = require('path');
const server = require('./config/server').server;
const io = require("./config/server").io;
const initSocket = require('./socket/init');
const port = process.env.PORT || 3000;
const expressStatusMonitor = require('express-status-monitor');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

// Rotas
const auth = require('./routes/auth');
const users = require('./routes/users');
const pages = require('./routes/pages');

// Start server
server.listen(port, () => { console.log(`Server started on port ${port}`); });

// Cors and body prser request configs
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressStatusMonitor({ websocket: io, port: app.get('port') }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static and public assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'))

// set routes
app.use('/', pages);
app.use('/auth', auth);
app.use('/users', users);

// Init socket
initSocket(io);