const Communicator = require('../models/Communicator');

contactServices = {};

contactServices.addContact = async (req, res) => {

	const { username, contact } = req.body;
	const user = await Communicator.findOne({ username });
	const { contacts } = user;
	const isAlreadyAdded = contacts.filter(user => user == contact);

	if (isAlreadyAdded.length === 0) {
		const newContacts = [ ...contacts, contact ];
		const payload = {
			$set: {
				contacts: newContacts
			}
		};
	
		try {
			await Communicator.updateOne({ username, ...payload });
			res.status(200).json({ res: "AddedSuccessfully" });
		} catch (error) {
			res.status(400).json({ res: "AddedFailed", error });
		}

	} else {
		res.status(400).json({ res: "AddedFailed", error: "AlreadyAContact" });
	}

}

contactServices.removeContact = async (req, res) => {

	const { username, contact } = req.body;
	const user = await Communicator.findOne({ username });
	const { contacts } = user;
	const isAContact = contacts.filter(user => user == contact);

	if (isAContact.length !== 0) {
		const newContacts = contacts.filter(user => user != contact);
		const payload = {
			$set: {
				contacts: newContacts
			}
		};

		try {
			await Communicator.updateOne({ username, ...payload });
			res.status(200).json({ res: "RemoveSuccessfully" });
		} catch (error) {
			res.status(400).json({ res: "RemoveFailed", error });
		}
	} else {
		res.status(400).json({ res: "RemoveFailed", error: "NotAContact" });
	}

}

module.exports = { contactServices };