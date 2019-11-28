const communicatorController = require('./../controllers/communicatorController').communicatorServices;
let previousMessagesArray = [];
let rooms = {};

module.exports = function(io) {

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
            socketClient.emit('previousMessages', previousMessagesArray);
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
}