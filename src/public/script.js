/** Apenas para teste => será substituido pelo front do Pedro */

let socket = io('http://localhost:3000', {transports: ['websocket'], rooms: "pedro"});

$(document).ready(async () => {
    let email = prompt("Seu email:");
    let username = prompt("Seu username:");
    
    $('input[name=username]').val(username);
    
    sessionStorage.setItem('email', email);
});

socket.on('connect', () => {
    socket.nsp = sessionStorage.getItem('email');
    let newNamespace = socket.nsp;
    console.log(`newNamespace: ${newNamespace}, connected: ${socket.connected}, id: ${socket.id}`);

    socket.emit('changeIdentification', {nsp: newNamespace, id: socket.id});
})


// Handler para submissão de mensagens
$('#chat').submit(event => {
    event.preventDefault();

    let author = $('input[name=username]').val();
    let message = $('input[name=message]').val();

    let authorExists = author.length;
    let messageExists = message.length;

    if (authorExists && messageExists) {
        let messageObject = { author, message };
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