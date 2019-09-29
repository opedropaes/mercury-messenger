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

let messages = []

io.on('connection', socketClient => {
    
    socketClient.emit('previousMessages', messages);

    socketClient.on('sendMessage', data => {

        let { author, message } = data;
        
        messages.push({
            id: socketClient.id,
            author,
            message
        });

        socketClient.broadcast.emit("receivedMessage", data);

    })
});