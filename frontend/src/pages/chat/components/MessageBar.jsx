import { TooltipWrapper } from '@/components/ToolTipWrapper'
import { useSocketContext } from '@/context/SocketContext'
import { apiClient } from '@/lib/api-client'
import { useAppStore } from '@/store'
import { UPLOAD_FILE_MESSAGE } from '@/utils/constants'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { RiEmojiStickerLine } from 'react-icons/ri'

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const {
    selectedChatType, 
    selectedChatData, 
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const socket = useSocketContext();
  const [message, setMessage] = useState("")
  const [emojiPicker, setEmojiPicker] = useState(false)

  const handleAddEmoji = (emoji) => {
    setMessage((msg)=>msg+emoji.emoji);
  }

  useEffect(()=>{
    function handleOutsideClick (event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  },[emojiRef])

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    if(selectedChatType==='contact') {
      const messageData = {
        sender: userInfo._id,
        recipient: selectedChatData._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
      }
      socket.emit("sendMessage",messageData)
    } else if (selectedChatType==='channel') {
      const messageData = {
        sender: userInfo._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      }
      socket.emit("send-channel-message",messageData) 
    }
    setMessage("")
  }

  const handleAttachementClick = ()=>{
    if(fileInputRef.current){
      fileInputRef.current.click()
    }
  }

  const handleAttachementChange = async (event) => {
    try {
      const file = event.target.files[0];
      if(file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_MESSAGE,formData,{
          withCredentials: true,
          onUploadProgress: data => {
            setFileUploadProgress(Math.round((100*data.loaded)/data.total));
          }
        });
        if(response.status===200 && response.data) {
          setIsUploading(false)
          setFileUploadProgress(0)
          if(selectedChatType === 'contact'){
            console.log("Inside msg");
            const messageData = {
              sender: userInfo._id,
              recipient: selectedChatData._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
            }
            socket.emit("sendMessage",messageData)
          } else if(selectedChatType === 'channel'){
            const messageData = {
              sender: userInfo._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            }
            socket.emit("send-channel-message",messageData) 
          }
        }
      }
    } catch(err){
      setIsUploading(false)
      setFileUploadProgress(0)
      console.log(err)
    }
  }


  return (
    <div className='h-[10dvh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6'>
      <div className="flex-1 flex rounded-md items-center gap-5 pr-5 bg-[#2a2b33]">
        <input 
          type="text" 
          className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none' 
          placeholder='Enter Your Message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <TooltipWrapper description={'Attachements'}>
          <button className='text-neutral-500 focus:border-none focus:outline-none hover:text-white duration-300 transition-all' onClick={handleAttachementClick}>
            <GrAttachment className='text-2xl' />
          </button>
        </TooltipWrapper>
        <input type="file" className='hidden' ref={fileInputRef} onChange={handleAttachementChange} />
        <div className="relative">
          <TooltipWrapper description={'Emoji'}>
              <button 
                className='text-neutral-500 focus:border-none focus:outline-none hover:text-white duration-300 transition-all'
                onClick={() => setEmojiPicker(!emojiPicker)}
              >
                <RiEmojiStickerLine className='text-2xl' />
              </button>
          </TooltipWrapper>
          
          <div className="absolute bottom-16 right-0 " ref={emojiRef}>
              <EmojiPicker
                theme='dark'
                open={emojiPicker}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
          </div>
        </div>
      </div>
      <TooltipWrapper description={'Send Message'}>
        <button 
          className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none focus:outline-none hover:bg-[#741bda] duration-300 transition-all'
          onClick={handleSendMessage}
        >
          <IoSend className='text-2xl' />
        </button>
      </TooltipWrapper>
      
    </div>
  )
}

export default MessageBar