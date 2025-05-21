import { useAppStore } from '@/store/index.js';
import { HOST } from '@/utils/constants';
import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const SocketContext = createContext(null);

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const {userInfo, addMessage} = useAppStore();
    useEffect(()=>{
        if(userInfo) {
            socket.current = io(HOST,{
                withCredentials: true,
                query: {
                    userId: userInfo._id
                }
            });
            socket.current.on('connect', () => {
                console.log('Connected to the Socket server');
            });

            const handleRecieveMessage = (message)=>{
                const { selectedChatData, selectedChatType, addContactInDMContacts } = useAppStore.getState();
                if(
                    selectedChatType!==undefined && 
                    ( selectedChatData._id===message.sender._id || selectedChatData._id===message.recipient._id ) 
                ) {
                    addMessage(message);
                }
                addContactInDMContacts(message)
                if(message.sender._id !== userInfo._id) {
                    const name = message.sender.name ? message.sender.name : message.sender.email;
                    toast.info(`${name} sent you a message`);
                }

            }

            const handleRecieveChannelMessage = (message)=> {
                const { selectedChatData, selectedChatType, addChannelInChannelList } = useAppStore.getState();
                if (
                    selectedChatType !== undefined &&
                    selectedChatData._id === message.channelId
                ) {
                    console.log(message);
                    console.log(userInfo._id);
                    addMessage(message);
                }
                addChannelInChannelList(message);
                if(message.sender._id !== userInfo._id) {
                    const name = message.sender.name ? message.sender.name.split(" ")[0] : message.sender.email.split("@")[0];
                    toast.info( 
                        `${name} sent you a message in ${message.channelName} channel`
                    );
                }

            }

            socket.current.on("recieveMessage", handleRecieveMessage);
            socket.current.on("recieve-channel-message", handleRecieveChannelMessage);

            return () => {
                socket.current.disconnect();
            }
        }
        
    },[userInfo])
    return (
        <SocketContext.Provider value={socket.current} >
            {children}
        </SocketContext.Provider>
    );
}

