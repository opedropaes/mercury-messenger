const express = require('express'); //Framework para construção de servidores em nodejs
const http = require('http'); //Biblioteca nativa do javascript que fornece o uso de métodos HTTP
const socket = require('socket.io'); //Framework que fornece o uso de métodos do protocolo WS

const app = express();
const server = http.createServer(app);
const io = socket(server);

//Segurança: Remove campo "x-powered-by" da header para prevenir ataques específicos ao framework utilizado
app.set('x-powered-by', false); 

module.exports = { app, server, io };