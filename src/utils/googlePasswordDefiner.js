// Define senha para registro de usuários que se cadastraram via api do Gmail a partir do email deles e da data de criação

const definePassword = (email) => {

	let ASCIICodeSplittedEmail = [];
	let ASCIICodeSplittedDate = [];
	let date = new Date();
	let now = date.now();
	let password = "";

	let bigger = (email.length > now.length) ? email.length : now.length;

	for (let i = 0; i < bigger; i++) {
		ASCIICodeSplittedEmail[i] = (typeof email[i].charCodeAt(0) === "number") ? email[i].charCodeAt(0) : 0;
		ASCIICodeSplittedDate[i] = (typeof now[i].charCodeAt(0) === "number") ? now[i].charCodeAt(0) : 0;
		password += JSON.stringify(ASCIICodeSplittedDate[i]) + JSON.stringify(ASCIICodeSplittedEmail[i]);
	}

	return password;

}

module.exports = definePassword;