/** Apenas para teste => será substituido pelo front do Pedro */

let socket = io('http://localhost:3000');

// Handler para submissão de mensagens
$('#chat').submit(event => {
    event.preventDefault();

    let author = $('input[name=username]').val();
    let message = $('input[name=message]').val();

    let authorExists = author.length;
    let messageExists = author.length;

    if (authorExists && messageExists) {
        let messageObject = { author, message };
        renderMessage(messageObject);
        socket.emit('sendMessage', messageObject);
    }

});

// Renderiza em tela as mensagens enviadas e recebidas
let renderMessage = messageObject => {
    let { author, message } = messageObject;
    let messageElement = `<div class="message"><strong>${author}:</strong>${message}</div>`;
    $('.messages').append(messageElement);
};

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