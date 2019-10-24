const Communicator = require('../models/Communicator');
const passwordDefiner = require('../utils/googlePasswordDefiner');

authServices = {}

authServices.register = async (req, res) => {
	let { method, name, email, username, password } = req.body;
	let communicator = {};

	try {
		switch (method) {
			case "google":
				communicator = await Communicator.create({ name, email, username, password });
			break;
			default:
				password = passwordDefiner.definePassword();
				console.log(password);
				communicator = await Communicator.create({ name, email, username, password });			
		}
		return res.send(communicator);
	}
	catch (err) {
		console.info(`${err}: Falha ao registrar`);
		return res.status(400).send({ error: "Falha ao registrar" });
	};


}

authServices.login = async (req, res) => {
	try {
		const { email } = req.body;
		const communicator = await Communicator.find({ email });
		return res.send(communicator);
	}
	catch (err) {
		console.info(`${err}: Falha ao logar`);
		return res.status(400).send({ error: "Falha ao logar" });
	}
}

module.exports = { authServices };