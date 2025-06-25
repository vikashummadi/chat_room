const express = require("express");
const http = require('http');
const path = require('path');
const { join } = require('node:path');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname,'public')));

app.get("/", (req,res)=>{
   res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection',(socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg)=>{
        io.emit('chat message', msg);
    });
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
});

server.listen(3000,()=>{
    console.log("Server running at http://localhost:3000");
});