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

communicatorServices.updateAccout = async (communicator) => {

	return new Promise(async (resolve, reject) => {
		const { newName, newEmail, username } = communicator;
		let updatedInfo = 0;

		if (newName) {
			const payload = { $set: { name: newName } };
			const updated = await Communicator.updateOne({ username, ...payload });

			if (updated.ok == 1) {
				updatedInfo++;
			}
		}

		if (newEmail) {
			const payload = { $set: { email: newEmail } };
			const updated = await Communicator.updateOne({ username, ...payload });

			if (updated.ok == 1) {
				updatedInfo++;
			}
		}

		if (updatedInfo != 0) {
			resolve({ res: "UpdateSuccessul", ok: 1 });
		} else {
			reject({ res: "UpdateFailed", ok: 0 });
		}
	})

}

communicatorServices.deleteAccount = async (username) => {

	return new Promise(async (resolve, reject) => {
		const deleted = await Communicator.deleteOne({ username });
		console.log(deleted)

		if (deleted.deletedCount == 1) {
			resolve({ res: "DeleteSuccessful", ok: 1 });
		} else {
			reject({ res: "DeleteFailed", ok: 0 });
		}
	})

}

communicatorServices.listAllCommunicators = async (req, res) => {
	try {
		let communicators = await Communicator.find();
		const usernames = communicators.map(communicator => communicator.username);
		return res.send(usernames);
	} catch (error) {
		return res.status(400).send({ error: `${error}` });
	}
}

module.exports = { communicatorServices };