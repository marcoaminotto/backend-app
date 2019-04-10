const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const cors = require("cors");


const app = express();

app.use(cors());// permite o acesso a todos

const server = require('http').Server(app);
const io = require('socket.io')(server);

//Aqui estarei conectando um usuário a uma sala única
io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box);
    });
});

mongoose.connect(
    'mongodb+srv://omnistack:omnistack@cluster0-65ogl.mongodb.net/omnistack?retryWrites=true', 
    {
        useNewUrlParser: true
    }
);
//Passa uma informação global para a aplicação, com isso todo o Controller que for chamado, terá acesso a informação io(linha11) dentro do req
app.use((req, res, next) => {
    req.io = io;

    return next();//necessário colocar para prosseguir
})


app.use(express.json());
app.use(express.urlencoded({extended: true})); //permite enviar arquivos
app.use('/files', express.static(path.resolve(__dirname, '..','tmp'))); //redirecionamento

app.use(require('./routes'));

server.listen(3333);

