import { useAppStore } from '@/store';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactContainer from './containers/ContactContainer';
import EmptyChatContainer from './containers/EmptyChatContainer';
import ChatContainer from './containers/ChatContainer';

const Chat = () => {
  const { userInfo, selectedChatType, } = useAppStore();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast.info('Please complete your profile to continue.');
      navigate('/profile');
    }
  },[userInfo, navigate])

  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactContainer />
      {
        selectedChatType === undefined ? <EmptyChatContainer /> : <ChatContainer />
      }
      {/* <EmptyChatContainer /> */}
      {/* <ChatContainer /> */}
    </div>
  )
}

export default Chat