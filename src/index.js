const app = require('./config/server').app;
const server = require('./config/server').server;
const io = require("./config/server").io;
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.use('/', (req, res) => {
    res.render('index.html');
});

// Array de mensagens passadas provisório => será substituido pelas mensagens no drive
let messages = [];

// Eventos do socket quando este é iniciado
io.on('connection', socketClient => {
    
    let id = socketClient.id;
    socketClient.emit('previousMessages', messages); //Envia ao client as mensagens trocadas anteriormente

    // Evento de envio e recepção de mensagens
    socketClient.on('sendMessage', data => {
        
        let { author, message } = data;
        messages.push({ id, author, message });
        socketClient.broadcast.emit('receivedMessage', data);

    })

});