/** Apenas para teste => será substituido pelo front do Pedro */
let socket = io('http://localhost:3000');

let user1 = prompt('user');
$('input[name=username]').val(user1);

socket.on('connect', () => {
	console.info(`conectado: ${socket.id}`);
	//TODO: rota de atualizar no banco o visto por ultimo e o online pra true
});

// Quandp clicar em alguem

let user2 = "user2"; //username do cara que ele clicou
let room = user1 + "-" + user2;
let roomConnectionData = { sender: user1, receiver: user2, room };

socket.emit('userConnectedToRoom', roomConnectionData);

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