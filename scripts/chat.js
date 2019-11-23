/** Apenas para teste => será substituido pelo front do Pedro */
let socket = io('http://localhost:3000'); // Função obtida através do CDN do socket.io

let communicator = window.location.href;
communicator = communicator.split('=')[1].split('&')[0];
let user2 = prompt("enviar mensagem para contato:"); // Deve ser mudado
let room = "";

$('input[name=username]').val(`${communicator} conversa com ${user2}`);

socket.on('connect', () => {

	const now = new Date();
		
	let day = now.getDate();
	let month = now.getMonth() + 1;
	let year = now.getFullYear();
	let hour = now.getHours();
	let minutes = now.getMinutes();
	day = (day < 10) ? ('0' + day).slice(-2) : day;
	month = (month < 10) ? ('0' + month).slice(-2) : month;
	hour = (hour < 10) ? ('0' + hour).slice(-2) : hour;
	minutes = (minutes < 10) ? ('0' + minutes).slice(-2) : minutes;
	
	const lastSeenAt = `${hour}:${minutes} - ${day}.${month}.${year}`;
	const communicatorDisconnected = { username: communicator, lastSeenAt };

	socket.on('disconnect', () => {
		//hideStatus(); -> esconde "online" embaixo do nome do usuario
		socket.emit('getDisconnected', communicatorDisconnected);
	});
});

// Executar quando clicar em alguem
const getRoomName = async (communicator, user2) => {
    
    let ASCIICodescommunicator = [];
    let ASCIICodesUser2 = [];
    let roomASCIICodes = [];
    let roomName = "";

    for (let char of communicator) {
        ASCIICodescommunicator.push(char.charCodeAt(0));
    }

    for (let char of user2) {
        ASCIICodesUser2.push(char.charCodeAt(0));
    }

    let biggerUsername = 0
    
    if (ASCIICodescommunicator.length > ASCIICodesUser2.length) 
        biggerUsername = ASCIICodescommunicator.length;
    else
        biggerUsername = ASCIICodesUser2.length;

    for (let i = 0; i < biggerUsername; i++) {

		let ASCIICodeFromcommunicator = parseInt(ASCIICodescommunicator[i]);
		let ASCIICodeFromUser2 = parseInt(ASCIICodesUser2[i]);
		
		ASCIICodeFromcommunicator = (!isNaN(ASCIICodeFromcommunicator)) ? ASCIICodeFromcommunicator : 0;
		ASCIICodeFromUser2 = (!isNaN(ASCIICodeFromUser2)) ? ASCIICodeFromUser2 : 0;
        
        roomASCIICodes[i] =  + ASCIICodeFromcommunicator + ASCIICodeFromUser2;
        roomName += JSON.stringify(roomASCIICodes[i]);
    }

    return roomName;
}

const getCommunicatorContacts = async () => {

	return new Promise((resolve, reject) => {
		fetch(`http://localhost:3000/${communicator}/listar-contatos`)
		.then(response => {
			response.json().then(res => {
				resolve(res.contacts);			
			})
		})
	})

}

// Executar quando carregar a pagina
const renderContacts = () => {
	getCommunicatorContacts()
		.then(contacts => {
			const contactsUl = document.getElementById('contacts');
			contacts.map(contact => {

				const contactTextNode = document.createTextNode(contact);
				const liElement = document.createElement('li');
				liElement.setAttribute('key', `contact-${contact}`);
				liElement.appendChild(contactTextNode);
				contactsUl.appendChild(liElement);
				
			});
		});
}

// Handler para submissão de mensagens
$('#chat').submit(event => {
    event.preventDefault();

    let author = $('input[name=username]').val().split(" ")[0];
    let message = $('input[name=message]').val();

    let authorExists = author.length;
    let messageExists = message.length;

    if (authorExists && messageExists) {
        let messageObject = { author, message, room };
        renderMessage(messageObject);
        clearMessageInput();
        socket.emit('sendMessage', messageObject);
    };

});

// Renderiza em tela as mensagens enviadas e recebidas
let renderMessage = messageObject => {
    let { author, message } = messageObject;
    let messageElement = `<div class="message"><strong>${author}:</strong> ${message}</div>`;
    $('.messages').append(messageElement);
};

// Limpa o input das mensagens
let clearMessageInput = () => {
    $('input[name=message]').val("");
}

socket.on('receivedMessage', messageObject => { 
    renderMessage(messageObject);
});

// Provisório => será substituido por algum método de recuperação de mensagens vindas do drive
socket.on('previousMessages', previousMessagesObject => { 
	
	for (item of previousMessagesObject) {
        if (room === item.room) {
			let messageObject = { author: item.author, message: item.message }
			renderMessage(messageObject);
		}
	}

});

// Execução forçada ao carregar pagina
getRoomName(communicator, user2)
    .then(response => {
        room = response;
        let roomConnectionData = { sender: communicator, receiver: user2, room };
		socket.emit('userConnectedToRoom', roomConnectionData);
		const communicatorOnline = { username: communicator, isOnline: true };
		socket.emit('getOnline', communicatorOnline);
		//showStatus(); -> "online" embaixo do nome do usuario
	});

renderContacts();