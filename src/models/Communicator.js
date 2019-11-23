const mongoose = require('../config/db').mongoose;
const bcrypt = require('bcryptjs');

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
	registerMethod: {
		type: String,
		required: true,
		default: "Mercury"
	},
	createdAt: {
		type: Date,
		default: Date.now,
		select: false
	},
	lastSeenAt: {
		type: Date,
		default: Date.now
	},
	isOnline: {
		type: Boolean,
	},
	contacts: {
		type: Array,
	}
});

// Usa função pre do mongoose para encriptar senha usando lib bcrypt antes de salvar no banco
CommunicatorSchema.pre('save', async function(next) {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
	next();
})

// Valida tamanho do username
CommunicatorSchema.path('username').validate(username => {
	return username.length <= 50 && username.length >= 3;
}, 'Username deve conter até 50 caracteres.');

// Cria model do componente Communicator
const Communicator = mongoose.model('Communicator', CommunicatorSchema);

module.exports = Communicator;