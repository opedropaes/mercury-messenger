// Define senha para registro de usuários que se cadastraram via api do Gmail a partir do email deles e da data de criação

const definePassword = async (email) => {

	let ASCIICodeSplittedEmail = [];
	let ASCIICodeSplittedDate = [];
	let now = JSON.stringify(Date.now());
	let password = "";
	let numberSequence = "";

	let bigger = (email.length > now.length) ? email.length : now.length;

	let emailArray = [];
	let nowArray = [];

	for (let i = 0; i < bigger; i++) {
		emailArray.push( (email[i] !== undefined) ? email[i] : " " );
		nowArray.push( (now[i] !== undefined) ? now[i] : " " );
	}

	for (let i = 0; i < emailArray.length; i++) {
		ASCIICodeSplittedEmail[i] = emailArray[i].charCodeAt(0);
		ASCIICodeSplittedDate[i] = nowArray[i].charCodeAt(0);
		numberSequence += JSON.stringify(ASCIICodeSplittedDate[i]) + JSON.stringify(ASCIICodeSplittedEmail[i]);
	}

	let partsQuantity = numberSequence.length / 10;
	let parts = []
	let startDivider = 0;
	let endDivider = 9

	for (let i = 0; i < partsQuantity; i++) {
		parts.push([numberSequence.slice(startDivider, endDivider)]);
		startDivider += 10;
		endDivider += 10;
	}

	let rangeToGetSliceOfDate = partsQuantity;
	let stringifiedDate = JSON.stringify(Date.now());
	let dateRange = stringifiedDate.slice(stringifiedDate.length - rangeToGetSliceOfDate, stringifiedDate.length); 
	let dateRangeSum = 0;

	for (let digit of dateRange) {
		dateRangeSum += parseInt(digit);
	}
	
	let sliceToChoose = dateRangeSum % parts.length;
	let choosenSlice = parts[sliceToChoose][0];
	let sizeToSetPassword = 0
	
	for (let digit of choosenSlice) {
		sizeToSetPassword += parseInt(digit);
	}

	sizeToSetPassword = choosenSlice.length - (sizeToSetPassword % choosenSlice.length);
	
	if (sizeToSetPassword < 6) {
		sizeToSetPassword = 6
	}

	password = choosenSlice.slice(0, sizeToSetPassword)

	return JSON.stringify(password);

}

module.exports = definePassword;