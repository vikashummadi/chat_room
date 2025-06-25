const express = require("express");
const http = require('http');
const path = require('path');
const { join } = require('node:path');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store connected users
const users = new Map();
const typingUsers = new Set();

app.use(express.static(path.join(__dirname,'public')));

app.get("/", (req,res)=>{
   res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection',(socket) => {
    console.log('a user connected');
    
    // Handle user joining with nickname
    socket.on('join', (nickname) => {
        // Check if nickname is already taken
        const existingUser = Array.from(users.values()).find(user => user.nickname === nickname);
        if (existingUser) {
            socket.emit('nickname_error', 'Nickname already taken!');
            return;
        }
        
        // Store user info
        const userData = {
            id: socket.id,
            nickname: nickname,
            joinedAt: new Date()
        };
        users.set(socket.id, userData);
        
        // Send success response to the joining user
        socket.emit('join_success', userData);
        
        // Broadcast user joined message
        io.emit('user_joined', {
            nickname: nickname,
            message: `${nickname} joined the chat`,
            timestamp: new Date()
        });
        
        // Send current online users to the new user
        socket.emit('online_users', Array.from(users.values()));
        
        // Broadcast updated online users list
        io.emit('update_online_users', Array.from(users.values()));
        
        console.log(`${nickname} joined the chat`);
    });
    
    // Handle chat messages
    socket.on('chat message', (data) => {
        const user = users.get(socket.id);
        if (!user) return;
        
        const messageData = {
            id: socket.id,
            nickname: user.nickname,
            message: data.message,
            timestamp: new Date(),
            isPrivate: data.isPrivate || false,
            toUser: data.toUser || null
        };
        
        if (data.isPrivate && data.toUser) {
            // Private message
            const targetUser = Array.from(users.values()).find(u => u.nickname === data.toUser);
            if (targetUser) {
                // Send to sender
                socket.emit('chat message', messageData);
                // Send to recipient
                io.to(targetUser.id).emit('chat message', messageData);
            } else {
                socket.emit('error', 'User not found!');
            }
        } else {
            // Public message - send to everyone except sender
            socket.broadcast.emit('chat message', messageData);
            // Send to sender immediately
            socket.emit('chat message', messageData);
        }
    });
    
    // Handle typing indicators
    socket.on('typing', (isTyping) => {
        const user = users.get(socket.id);
        if (!user) return;
        
        if (isTyping) {
            typingUsers.add(socket.id);
        } else {
            typingUsers.delete(socket.id);
        }
        
        // Broadcast typing status to all users except the typing user
        socket.broadcast.emit('typing_status', {
            nickname: user.nickname,
            isTyping: isTyping
        });
    });
    
    // Handle disconnect
    socket.on('disconnect',()=>{
        const user = users.get(socket.id);
        if (user) {
            // Remove from typing users
            typingUsers.delete(socket.id);
            
            // Remove from users
            users.delete(socket.id);
            
            // Broadcast user left message
            io.emit('user_left', {
                nickname: user.nickname,
                message: `${user.nickname} left the chat`,
                timestamp: new Date()
            });
            
            // Broadcast updated online users list
            io.emit('update_online_users', Array.from(users.values()));
            
            console.log(`${user.nickname} disconnected`);
        } else {
            console.log('user disconnected');
        }
    });
});

server.listen(3000,()=>{
    console.log("Server running at http://localhost:3000");
});