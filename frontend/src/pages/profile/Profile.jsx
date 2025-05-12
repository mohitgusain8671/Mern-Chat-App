import { useAppStore } from '@/store'
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'
import { colors, getColor } from '@/lib/utils';
import { FaTrash, FaPlus } from 'react-icons/fa'
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTES, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTES } from '@/utils/constants';

const Profile = () => {
  const navigate = useNavigate();
  const {userInfo, setUserInfo} = useAppStore();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if(userInfo.profileSetup){
      setName(userInfo.name);
      setBio(userInfo.bio);
      setSelectedColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo])
  

  const validateProfile = () => {
    if(!name){
      toast.error("Name is Required");
      return false;
    }
    if(!bio){
      toast.error("Bio is Required");
      return false;
    }
    return true;
  }

  const saveChanges = async () => {
    if(validateProfile()){
      try{
        const response = await apiClient.post(UPDATE_PROFILE_ROUTES,{
          name, bio, selectedColor
        },{ withCredentials: true });
        if(response.data.success===true && response.data.user){
          setUserInfo({...response.data.user})
        }
        toast.success("Profile Updated Successfully");
        navigate("/chat");
      } catch(err){

      }
    }
  }

  const handleNavigateBack = () => {
    if(userInfo.profileSetup){
      navigate('/chat');
    } else {
      toast.error('Please Setup Your Profile First');
    }
    
  }

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  }
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if(file){
      const formData = new FormData();
      formData.append('profile-image', file);
      try{
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTES,formData,{withCredentials:true});
        if(response.data.success===true && response.data.image){
          setUserInfo({...userInfo,image:response.data.image});
          toast.success("Image Updated SuccessFully");
        }
      } catch(err){
        console.log(err);
        toast.error("Internal Server Error! Please Try Again");
      } 
    }
  };

  const handleDeleteImage = async (event) => {
    try{
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true});
      if(response.data.success===true){
        setUserInfo({...userInfo,image:null});
        setImage(null);
        toast.success(response.data.message);
      }else {
        toast.error(response.data.message);
      }
    } catch(err){
      console.log(err);
      toast.error("Internal Server Error! Please Try Again");
    }
  };

  return (
    <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-co gap-10'>
      <div className='flex flex-col gap-10 w-[80vw] md:w-max'>
        <div>
          <IoArrowBack 
            className='text-4xl lg:text-6xl text-white/90 cursor-pointer' 
            onClick={handleNavigateBack}
          />
        </div>
        <div className='grid grid-cols-2'>
          <div 
            className='h-full w-32 md:w-48 md:h-48 reative flex items-center justify-center'
            onMouseEnter={()=>setHovered(true)}
            onMouseLeave={()=>setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden" >
              {
                image ? <AvatarImage src={image} alt="profile" className="object-cover w-full h-full"/> : (
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)} `}>
                    {name?name.split("").shift():userInfo.email.split("").shift()}
                  </div>
                )
              }
            </Avatar>
            {
              hovered && (
                <div 
                  className="absolute h-32 w-32 md:w-48 md:h-48  flex justify-center items-center bg-black/60 rounded-full cursor-pointer ring-fuchsia-50 "
                  onClick={image? handleDeleteImage : handleFileInputClick }
                >
                  {
                    image ? <FaTrash className='text-3xl text-white' /> : <FaPlus className='text-3xl text-white' />
                  }
                </div>
              )
            }
            <input 
              type="file" 
              ref={fileInputRef} 
              className='hidden' 
              onChange={handleImageChange} 
              name="profile-image" 
              accept='.png, .jpg, .jpeg, .svg, .webp' 
            />
          </div>
          <div className='flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center'>
            <div className='w-full'>
              <Input 
                placeholder="Email" 
                type="email" 
                disabled 
                value={userInfo.email} 
                className='rounded-lg p-6 bg-[#2c2e3b] border-none '
              />
            </div>
            <div className='w-full'>
              <Input 
                placeholder="Name" 
                type="text"
                onChange={(e)=>setName(e.target.value)}
                value={name} 
                className='rounded-lg p-6 bg-[#2c2e3b] border-none '
              />
            </div>
            <div className='w-full'>
              <Textarea 
                placeholder="Bio" 
                onChange={(e)=>setBio(e.target.value)}
                value={bio}
                maxLength={150} 
                maxRow
                className='rounded-lg p-6 bg-[#2c2e3b] border-none resize-none'
              />
            </div>
            <div className='w-full flex gap-5'>
              {
                colors.map((color, index) => (
                <div 
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor===index && " outline-white/70 outline-1"} `}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                >
                </div>
                ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile