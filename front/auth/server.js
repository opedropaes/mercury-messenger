//Para rodar sapoha tem que escrever o seguinte no terminal:
//npm run-script devStart       ou        npm devStart
//Isso vai rodar o nodemon e o server.js

//Instalem a extensão Rest Cliente no VSCode
//No arquivo request.rest existe GET e POST, logo em cima existe a opção "send request"
//Essa opção é um botão, cliquem nela para fazer uma request no servidor.

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

//
app.post("/users/login", async (req, res) => {
  const user = users.find(user => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
      res.send("yan");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(8080);
