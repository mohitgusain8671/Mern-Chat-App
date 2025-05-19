import { useAppStore } from '@/store';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactContainer from './containers/ContactContainer';
import EmptyChatContainer from './containers/EmptyChatContainer';
import ChatContainer from './containers/ChatContainer';

const Chat = () => {
  const { 
    userInfo, 
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress, 
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast.info('Please complete your profile to continue.');
      navigate('/profile');
    }
  },[userInfo, navigate])

  return (
    <div className='flex h-[100dvh] text-white overflow-hidden'>
      {
        isUploading && <div className='h-[100dvh] w-[100vw] fixed top-0 left-0 z-10 bg-black/80 flex flex-col justify-center items-center gap-5 backdrop-blur-lg' >
          <h5 className='text-5xl animate-pulse' >Uploading File</h5> 
          {fileUploadProgress}%
        </div>
      }
      {
        isDownloading && <div className='h-[100dvh] w-[100vw] fixed top-0 left-0 z-10 bg-black/80 flex flex-col justify-center items-center gap-5 backdrop-blur-lg' >
          <h5 className='text-5xl animate-pulse' >Downloading File</h5> 
          {fileDownloadProgress}%
        </div>
      }
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