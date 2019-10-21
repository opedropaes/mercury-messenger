const app = require('./config/server').app;
const server = require('./config/server').server;
const io = require("./config/server").io;
const port = process.env.PORT || 3000;
const expressStatusMonitor = require('express-status-monitor');

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.use('/', (req, res) => {
    res.render('index.html');
});

app.use(expressStatusMonitor({ websocket: io, port: app.get('port') })); 

// Array de mensagens passadas provisório => será substituido pelas mensagens no drive
let previousMessagesArray = [];

// Mapa que armazena a sequencia numerica dinamica de cada cliente por chave => valor
let sequenceNumberByClient = new Map();

// Eventos do socket quando este é iniciado
io.on('connection', socketClient => {

    let id = socketClient.id;
    // console.info(`Client connected: ${id}`);

    sequenceNumberByClient.set(socketClient, 1);

    socketClient.emit('previousMessages', previousMessagesArray); //Envia ao client as mensagens trocadas anteriormente

    // Evento de envio e recepção de mensagens
    socketClient.on('sendMessage', data => {
        let { author, message } = data;
        previousMessagesArray.push({ id, author, message });
        socketClient.broadcast.emit('receivedMessage', data);
    });

    socketClient.on('disconnect', () => {
        sequenceNumberByClient.delete(socketClient);
        console.info(`Client disconnected: ${id}`);
    });

    socketClient.on('changeIdentification', newIdentification => {
        console.info(newIdentification);
    })

});

// setInterval(() => {
//     for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
//         console.info(`Client: ${client.nsp.name}, sequence: ${sequenceNumber}`)
//         client.emit('receiveSequenceNumber', sequenceNumber);
//         sequenceNumberByClient.set(client, sequenceNumber + 1);
//     }
// }, 1000);