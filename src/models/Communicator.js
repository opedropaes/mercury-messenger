const mongoose = require('../config/db').mongoose;

// Cria Schema de cadastro de um usuário
const CommunicatorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	username: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	lastSeenAt: {
		type: Date,
		default: Date.now
	}
});

// Valida tamanho do username
CommunicatorSchema.path('username').validate(username => {
	return username.length <= 50;
}, 'Username deve conter até 50 caracteres.');

// Cria model do componente Communicator
const Communicator = mongoose.model('Communicator', CommunicatorSchema);

module.exports = Communicator;