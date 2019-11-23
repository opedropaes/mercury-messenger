const Communicator = require('../models/Communicator');

communicatorServices = {}

communicatorServices.getContacts = async (req, res) => {

	const { username } = req.params;
	const communicator = await Communicator.findOne({ username });
	
	if (communicator) {
		const { contacts } = communicator;
		res.status(200).send({ username, contacts });
	} else {
		res.status(404).send({ res: "UserNotFound" });
	}

}

module.exports = { communicatorServices };