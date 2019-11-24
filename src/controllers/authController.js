const Communicator = require('../models/Communicator');
const definePassword = require('../utils/googlePasswordDefiner');
const bcrypt = require('bcryptjs');
const AcessToken = require('../models/AccessToken');

authServices = {}

authServices.register = async (req, res) => {
	let { method, name, email, username, password } = req.body;
	let communicator = {};

	try {
		if (method === "google") {
			password = await definePassword(email);
		}
				
		communicator = await Communicator.create({ name, email, username, password, registerMethod: method });
		const token = await AcessToken.getToken(communicator.id, communicator.createdAt);
		
		return ({ communicator, token });
	}
	catch (err) {
		console.info(`${err}: Falha ao registrar`);
		return res.status(400).send({ error: "RegistrationFailed" });
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
						
						const token = await AcessToken.getToken(communicator.id, communicator.createdAt);
						return ({ communicator, token });
					
					} else return ({ error: "PasswordFailed" });
				} else return ({ error: "UserNotFound" });
			} else return ({ error: "EmptyField" });	
		
		// Login pelo google

		} else if (method === "google") {
			if (username) {
				let communicator = await Communicator.findOne({ username });

				if (communicator.registerMethod === "Mercury") {
					return ({ err: "Falha ao logar - Você não está cadastrado usando uma conta Google." });
				}
			
				if (communicator) {
					const token = await AcessToken.getToken(communicator.id, communicator.createdAt);
					return ({ communicator, token });

				} else return ({ error: "Falha ao logar - Usuário não encontrado!" });
			}
		}
	}
	catch (err) {
		console.info(`${err}: Falha ao logar`);
		return ({ error: "Falha ao logar" });
	}
}

module.exports = { authServices };