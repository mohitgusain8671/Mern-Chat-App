import { useAppStore } from '@/store/index.js';
import { HOST } from '@/utils/constants';
import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';

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
                const { selectedChatData, selectedChatType } = useAppStore.getState();
                if(
                    selectedChatType!==undefined && 
                    ( selectedChatData._id===message.sender._id || selectedChatData._id===message.recipient._id ) 
                ) {
                    console.log("Recieved Message: ", message);
                    addMessage(message);
                }

            }

            socket.current.on("recieveMessage", handleRecieveMessage);

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

