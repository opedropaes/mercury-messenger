const express = require('express'); //Framework para construção de servidores em nodejs
const path = require('path'); //Biblioteca nativa do javascript que fornece os arquivos num caminho específico
const http = require('http'); //Biblioteca nativa do javascript que fornece o uso de métodos HTTP
const socket = require('socket.io'); //Biblioteca externa que fornece o uso de métodos do protocolo WS

const app = express();
const server = http.createServer(app);
const io = socket(server);

//Desabilita o envio do nome do framework como parâmetro nas headers HTTP. Questão de segurança.
app.set('x-powered-by', false); 

//Configura o servidor para servir os documentos estáticos contidos em {@dir} public
app.use(express.static('public'));

//Configura os arquivos de visualização como os contidos em {@dir} public
app.set('views', 'public');

//Configura a engine de visualização como o padrão ejs para html
app.engine("html", require("ejs").renderFile);

//Configura a engine de visualização para renderizar arquivos com extensão html
app.set('view engine', 'html');

module.exports = { app, server, io };