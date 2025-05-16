import { TooltipWrapper } from '@/components/ToolTipWrapper'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { RiEmojiStickerLine } from 'react-icons/ri'

const MessageBar = () => {
  const emojiRef = useRef();

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

  }

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6'>
      <div className="flex-1 flex rounded-md items-center gap-5 pr-5 bg-[#2a2b33]">
        <input 
          type="text" 
          className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none' 
          placeholder='Enter Your Message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <TooltipWrapper description={'Attachements'}>
          <button className='text-neutral-500 focus:border-none focus:outline-none hover:text-white duration-300 transition-all'>
            <GrAttachment className='text-2xl' />
          </button>
        </TooltipWrapper>
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