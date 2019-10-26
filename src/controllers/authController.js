const Communicator = require('../models/Communicator');
const definePassword = require('../utils/googlePasswordDefiner');
const bcrypt = require('bcryptjs');

authServices = {}

authServices.register = async (req, res) => {
	let { method, name, email, username, password } = req.body;
	let communicator = {};

	try {
		if (method === "google") {
			password = await definePassword(email);
		}
		communicator = await Communicator.create({ name, email, username, password });
		return res.send(communicator);
	}
	catch (err) {
		console.info(`${err}: Falha ao registrar`);
		return res.status(400).send({ error: "Falha ao registrar" });
	};

}

authServices.login = async (req, res) => {
	try {
		let { username, password } = req.body;

		if (password && username) {
			let communicator = await Communicator.findOne({ username }).select('+password');

			if (communicator) {
				if (await bcrypt.compare(password, communicator.password)) {
					return res.send(communicator);
				} else {
					return res.status(400).send({ error: "Falha ao logar - Senha incorreta!" });
				}
			} else {
				return res.status(400).send({ error: "Falha ao logar - Usuário não encontrado!" });
			}

		} else {
			return res.status(400).send({ error: "Falha ao logar - Usuario e senha devem estar presentes!" });
		}

		// TODO: Autenticar usuario

	}
	catch (err) {
		console.info(`${err}: Falha ao logar`);
		return res.status(400).send({ error: "Falha ao logar" });
	}
}

authServices.delete = async (req, res) => {
	try {
		let { username } = req.body;
		let deleted = await Communicator.remove({ username });
		return res.send(deleted);
	} catch (error) {
		return res.status(400).send({ error: `${error}` });
	}
}

authServices.list = async (req, res) => {
	try {
		let users = await Communicator.find();
		return res.send(users);
	} catch (error) {
		return res.status(400).send({ error: `${error}` });
	}
}

module.exports = { authServices };