/** Apenas para teste => será substituido pelo front do Pedro */
let socket = io('http://localhost:3000');

let user1 = prompt('user');
let user2 = prompt('user2');
$('input[name=username]').val(user1);

socket.on('connect', () => {
	console.info(`conectado: ${socket.id}`);
	//TODO: rota de atualizar no banco o visto por ultimo e o online pra true
});

// Quandp clicar em alguem

const getRoomName = async (user1, user2) => {
    
    let ASCIICodesUser1 = [];
    let ASCIICodesUser2 = [];
    let roomASCIICodes = [];
    let roomName = "";

    for (let char of user1) {
        ASCIICodesUser1.push(char.charCodeAt(0));
    }

    for (let char of user2) {
        ASCIICodesUser2.push(char.charCodeAt(0));
    }

    let biggerUsername = 0
    
    if (ASCIICodesUser1.length > ASCIICodesUser2.length) 
        biggerUsername = ASCIICodesUser1.length;
    else
        biggerUsername = ASCIICodesUser2.length;

    for (let i = 0; i < biggerUsername; i++) {
        let ASCIICodeFromUser1 = (typeof parseInt(ASCIICodesUser1[i]) === "number") ? parseInt(ASCIICodesUser1[i]) : 0;
        let ASCIICodeFromUser2 = (typeof parseInt(ASCIICodesUser2[i]) === "number") ? parseInt(ASCIICodesUser2[i]) : 0;
        
        roomASCIICodes[i] =  + ASCIICodeFromUser1 + ASCIICodeFromUser2;
        roomName += JSON.stringify(roomASCIICodes[i]);
    }

    return roomName;
}


// let user2 = "user2"; //username do cara que ele clicou
getRoomName(user1, user2)
    .then(response => {
        console.log(response)
        let room = response;
        let roomConnectionData = { sender: user1, receiver: user2, room };
        socket.emit('userConnectedToRoom', roomConnectionData);
    });



// Handler para submissão de mensagens
$('#chat').submit(event => {
    event.preventDefault();

    let author = $('input[name=username]').val();
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

/** Eventos do socket para recebimento de mensagens */

socket.on('receivedMessage', messageObject => { 
    renderMessage(messageObject);
});

// Provisório => será substituido por algum método de recuperação de mensagens vindas do drive
socket.on('previousMessages', previousMessagesArray => { 
    for (message of previousMessagesArray) {
        renderMessage(message);
    }
});

socket.on('receiveSequenceNumber', sequence => {
    console.info(sequence);
})