'use-strict';

const md5 = require('md5');
const jwt = require('jsonwebtoken');

async function getToken(id, createdAt) {
	const secret = md5(id + createdAt + JSON.stringify(Date.now()));
	const token = jwt.sign({ id }, secret, {
		expiresIn: 86400,
	});

	return token;
}

module.exports.getToken = getToken;