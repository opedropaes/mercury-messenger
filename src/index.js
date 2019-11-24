const app = require('./config/server').app;
const server = require('./config/server').server;
const io = require("./config/server").io;
const port = process.env.PORT || 3000;
const expressStatusMonitor = require('express-status-monitor');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const cors = require('cors');

const communicatorController = require('./controllers/communicatorController').communicatorServices;

server.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressStatusMonitor({ websocket: io, port: app.get('port') }));
app.use(router);

// Array de mensagens passadas
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
		previousMessagesArray.push({ author, message, room }); 
		socketClient.to(room).broadcast.emit('receivedMessage', data);
	});

	socketClient.emit('previousMessages', previousMessagesArray);

	socketClient.on('getOnline', communicatorOnline => {
		communicatorController.updateStatus(communicatorOnline)
			.then(updatedStatus => {
				const { username, isOnline, ok } = updatedStatus;
				console.log(`ok: ${ok} - ${username} status updated to ${isOnline}`);
			})
			.catch(err => {
				console.log(err);
			});
	});

	socketClient.on('disconnect', () => {
		console.info(`Client disconnected: ${socketClient.id}`);
	});

	socketClient.on('getDisconnected', communicatorDisconnected => {
		communicatorController.updateLastSeenAt(communicatorDisconnected)
			.then(updatedLastSeenAt => {
				const { username, updateLastSeenAt, ok } = updatedLastSeenAt;
				console.log(`ok: ${ok} - ${username} last seen at ${updateLastSeenAt}`);
			})
	});

});