import { Server as SocketIOServer } from 'socket.io'
import { ORIGIN } from './config/env.js';
import Message from './models/message.model.js';

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

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        // save message
        const createMessage = await Message.create(message);

        const messageData = await Message.findById(createMessage._id)
        .populate("sender","id email name image color")
        .populate("recipient","id email name image color");

        if(recipientSocketId){
            io.to(recipientSocketId).emit("recieveMessage",messageData);
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("recieveMessage",messageData);
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

        socket.on('sendMessage',sendMessage);

        socket.on('disconnect', ()=>disconnect(socket));
    });
}

export default serverSocket;