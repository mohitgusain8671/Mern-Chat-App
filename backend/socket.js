import { Server as SocketIOServer } from 'socket.io'
import { ORIGIN } from './config/env.js';
import Message from './models/message.model.js';
import Channel from './models/channel.model.js'

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

    const sendChannelMessage = async(message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;
        const newMessage = await Message.create({
            sender,
            recipient: null,
            content,
            timeStamp: Date.now(),
            messageType,
            fileUrl
        })
        const messageData = await Message.findById(newMessage._id)
        .populate("sender","id email name image color").exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: newMessage._id }
        });

        const channel = await Channel.findById(channelId).populate("members").exec();
        const finalData = {...messageData._doc, channelId: channel._id, channelName: channel.name};

        if(channel && channel.members){
            channel.members.forEach((member) => {
                const socketId = userSocketMap.get(member._id.toString());
                if(socketId){
                    io.to(socketId).emit("recieve-channel-message", finalData);
                } 
            });
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if(adminSocketId){
                io.to(adminSocketId).emit("recieve-channel-message", finalData);
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

        socket.on('sendMessage',sendMessage);
        socket.on('send-channel-message',sendChannelMessage);

        socket.on('disconnect', ()=>disconnect(socket));
    });


}

export default serverSocket;