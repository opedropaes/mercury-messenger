const Communicator = require('../models/Communicator');

communicatorServices = {}

communicatorServices.getContacts = async (req, res) => {

	const { username } = req.params;
	const communicator = await Communicator.findOne({ username });
	
	if (communicator) {
		const { contacts } = communicator;
		const sortedContacts = contacts.sort();
		res.status(200).send({ username, contacts: sortedContacts });
	} else {
		res.status(404).send({ res: "UserNotFound" });
	}

}

communicatorServices.updateStatus = async (communicator) => {

	return new Promise(async (resolve, reject) => {

		if (communicator.isOnline) {
			const { username, isOnline } = communicator;
			const payload = { $set: { isOnline } };
			const updated = await Communicator.updateOne({ username, ...payload });

			if (updated.ok == 1) {
				resolve({ username, isOnline, ok: true });
			} else {
				reject({ username, isOnline: false, ok: false });
			}
		} else {
			const { username, isOnline } = communicator;
			const payload = { $set: { isOnline: false } };
			const updated = await Communicator.updateOne({ username, ...payload });
			
			if (updated.ok == 1) {
				resolve({ username, isOnline: false, ok: true });
			} else {
				reject({ username, isOnline, ok: false });
			}
		}
	});

}

communicatorServices.updateLastSeenAt = async (communicator) => {

	return new Promise(async (resolve, reject) => {

		const { username, lastSeenAt } = communicator;
		const payload = { $set: { lastSeenAt }};
		const updated = await Communicator.updateOne({ username, ...payload });

		if (updated.ok == 1) {
			resolve({ username, lastSeenAt, ok: true });
		} else {
			reject({ username, ok: false });
		}

	});

}	

module.exports = { communicatorServices };