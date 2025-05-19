import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store'
import { GET_MESSAGES, HOST } from '@/utils/constants';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from 'react-icons/io5';

const MessageContainer = () => {

  const scrollRef = useRef();
  const { 
    selectedChatType, 
    selectedChatData, 
    userInfo, 
    selectedChatMessages, setSelectedChatMessages,
    setIsDownloading, setFileDownloadProgress 
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(()=>{
    const getMessages = async () => {
      try{
        const res = await apiClient.post(GET_MESSAGES,{id: selectedChatData._id},{withCredentials: true});
        if(res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch(err){
        console.log(err);
      }
    }
    if(selectedChatData._id){
      if(selectedChatType==='contact') getMessages();
    }

  },[selectedChatData,selectedChatType,setSelectedChatMessages])

  useEffect(()=>{
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behavior: "smooth"})
    }
  },[selectedChatMessages])

  const isImage = (path) => {
    const imgRegex = 
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imgRegex.test(path);
  }

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message,index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className='text-center text-gray-500 my-2'>
              {moment(message.timestamp).format("LL")}
            </div>)}
          {
            selectedChatType==="contact" && (
              renderDMMessages(message)
            )
          }
        </div>
      )
    });
  };
  
  const downloadFile = async (url) => {
    setIsDownloading(true);
    const response = await apiClient.get(`${HOST}/${url}`,{
      responseType:'blob',
      onDownloadProgress: (ProgressEvent)=>{
        const {loaded, total} = ProgressEvent;
        const progress = Math.round((loaded * 100 / total));
        setFileDownloadProgress(progress);
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download",url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  }

  const renderDMMessages = (message) => 
    <div className={`${message.sender===selectedChatData._id?"text-left":"text-right"}`} >
      {
        message.messageType==='text' && (
          <div 
            className={`${
              message.sender!==selectedChatData._id?
              "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50": 
              "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"}
              border inline-block px-3 py-2 rounded-lg my-1 max-w-[50%]  text-lg break-words
              `} >
            {message.content}
          </div>
        )
      }
      {
        message.messageType==='file' && (
          <div 
            className={`${
              message.sender!==selectedChatData._id?
              "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50": 
              "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"}
              border inline-block px-3 py-2 rounded-lg my-1 max-w-[50%]  text-lg break-words
              `} >
            {isImage(message.fileUrl)?<div 
              className='cursor-pointer' 
              onClick={() =>{ 
                setShowImage(true); 
                setImageUrl(message.fileUrl); 
              }}
            >
              <img 
                src={`${HOST}/${message.fileUrl}`} 
                height={300} 
                width={300} 
              />
            </div>:<div className='flex items-center justify-center ' >
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span className='mx-3' >
                {/* fileName */}
                {message.fileUrl.split("/").pop()} 
              </span>
              <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300' 
              onClick={() => downloadFile(message.fileUrl)} >
                <IoMdArrowRoundDown />
              </span>
              
            </div>}
          </div>
        )
      }
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
      
    </div>
  


  return (
    <div className='flex-1 overflow-y-auto no-scrollbar py-4 px-8 md:w-[65vw] lg:[70vw] xl:w-[80vw] w-full' >
      {renderMessages()}
      <div ref={scrollRef}></div>
      {
        showImage && (
        <div className="fixed top-0 z-[1000] left-0 h-[100dvh] w-[100vw] flex items-center justify-center flex-col backdrop-blur-lg">
          <div>
            <img src={`${HOST}/${imageUrl}`} 
              className='h-[80dvh] w-full bg-cover mt-5'
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button 
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={()=>downloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button 
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={()=> { 
                setShowImage(false)
                setImageUrl(null) 
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>)
      }
    </div>
  )
}

export default MessageContainer