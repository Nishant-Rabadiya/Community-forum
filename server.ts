const express = require('express');
const next = require('next');
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const http = require('http');
const socketIO = require('socket.io');

app.prepare().then(async () => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIO(httpServer);

    io.on('connection', (socket: any) => {
        console.log('Client connected');

        socket.on('newPost', (post: any) => {
            io.emit('newPost', post);
        });

        socket.on('new-comment', (comment: any) => {
            io.emit('new-comment', comment);
        });

        socket.on('reply', (reply: any) => {
            io.emit('reply', reply);
        });

        socket.on('update-registration', (registrationData: any) => {
            io.emit('update-registration', registrationData);
        });
    });

    server.all('*', (req: any, res: any) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

