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

let rooms = {};

// Eventos do socket quando este é iniciado
io.on('connection', socketClient => {

	socketClient.on('userConnectedToRoom', roomConnectionData => {

		let { sender, receiver, room } = roomConnectionData;

		// Sender conectado na sala
		socketClient.join(room);

		console.log(`${sender} joined ${room} as sender to ${receiver}`);

		rooms[room] = { users: [] };
		rooms[room].users[socketClient.id] = sender;

	});

	socketClient.on('sendMessage', data => {
		let { author, message, room } = data;
		previousMessagesArray.push({ author, message }); // vai sumir depois pra virar persistencia no drive
		socketClient.to(room).broadcast.emit('receivedMessage', data);
	});

	socketClient.on('disconnect', () => {
		console.info(`Client disconnected: ${socketClient.id}`);
	});

});

// const nsp = io.of('/teste');

// nsp.on('connection', socketClient => {

// 	let id = socketClient.id;

// 	socketClient.emit('previousMessages', previousMessagesArray); //Envia ao client as mensagens trocadas anteriormente

//     // Evento de envio e recepção de mensagens
    // socketClient.on('sendMessage', data => {
    //     let { author, message } = data;
    //     previousMessagesArray.push({ id, author, message });
    //     socketClient.broadcast.emit('receivedMessage', data);
    // });

//     socketClient.on('disconnect', () => {
//         sequenceNumberByClient.delete(socketClient);
//         console.info(`Client disconnected: ${id}`);
//     });

//     socketClient.on('changeIdentification', newIdentification => {
//         console.info("newIdentification");
//     })

// })