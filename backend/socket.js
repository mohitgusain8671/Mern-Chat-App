import { Server as SocketIOServer } from 'socket.io'
import { ORIGIN } from './config/env.js';

const serverSocket = (server) => {
    const io = new SocketIOServer(server,{
        cors: {
            origin: ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    const userSocketMap = new Map();
    const disconnect = (socket) => {
        console.log("Cient Disconnected");
        for(const [userId,socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
    }
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if(userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected:${userId} with socket id:${socket.id}`);
        } else {
            console.log('User connected without userId');
        }
        socket.on('disconnect', ()=>disconnect(socket));
    });
}

export default serverSocket;