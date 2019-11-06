const Communicator = require('../models/Communicator');
const definePassword = require('../utils/googlePasswordDefiner');
const bcrypt = require('bcryptjs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

authServices = {}

authServices.register = async (req, res) => {
	let { method, name, email, username, password } = req.body;
	let communicator = {};

	try {
		if (method === "google") {
			password = await definePassword(email);
		}
		communicator = await Communicator.create({ name, email, username, password, registerMethod: method });
		return ({ communicator });
	}
	catch (err) {
		console.info(`${err}: Falha ao registrar`);
		return res.status(400).send({ error: "Falha ao registrar" });
	};

}

authServices.login = async (req, res) => {
	try {
		let { username, password, method } = req.body;

		// Login pela tela padrão da aplicação

		if (method !== "google") {
			if (password && username) {
				let communicator = await Communicator.findOne({ username }).select('+password');
	
				if (communicator) {
					if (await bcrypt.compare(password, communicator.password)) {
						let secret = md5(communicator.id + communicator.createdAt + JSON.stringify(Date.now()));
						let token = jwt.sign({ id: communicator.id }, secret, {
							expiresIn: 86400,
						});
	
						return ({ communicator, token });
					} else return ({ error: "PasswordFailed" });
				} else return ({ error: "UserNotFound" });
			} else return ({ error: "EmptyField" });	
		
		// Login pelo google

		} else if (method === "google") {
			if (username) {
				let communicator = await Communicator.findOne({ username });

				if (communicator.registerMethod === "Mercury") {
					// return res.status(400).send({ err: "Falha ao logar - Você não está cadastrado usando uma conta Google." });
					return ({ err: "Falha ao logar - Você não está cadastrado usando uma conta Google." });
				}
			
				if (communicator) {
					let secret = md5(communicator.id + communicator.createdAt + JSON.stringify(Date.now()));
					let token = jwt.sign({ id: communicator.id }, secret, {
						expiresIn: 86400,
					});
	
					// return res.status(200).send({ communicator, token });
					return ({ communicator, token });

				// } else return res.status(400).send({ error: "Falha ao logar - Usuário não encontrado!" });
				} else return ({ error: "Falha ao logar - Usuário não encontrado!" });
			}
		}
	}
	catch (err) {
		console.info(`${err}: Falha ao logar`);
		return ({ error: "Falha ao logar" });
	}
}

// Metodos usados para teste, não entrarão como artefato de  baseline

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
		// return users;
	} catch (error) {
		return res.status(400).send({ error: `${error}` });
	}
}

module.exports = { authServices };