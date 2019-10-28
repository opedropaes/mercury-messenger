// Cria conexão com o banco de dados (MongoDB precisa estar instalado na máquina)

const mongoose = require('mongoose');

const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };

mongoose.connect('mongodb://localhost/mm-communicator-2', options);
mongoose.Promise = global.Promise;

module.exports.mongoose = mongoose;