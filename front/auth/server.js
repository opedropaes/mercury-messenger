const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const users = [{ name: "yan" }];

app.get("/users", (req, res) => {
  res.text(users);
});

app.listen(8080);
