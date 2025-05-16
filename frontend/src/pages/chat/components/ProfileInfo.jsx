import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { HOST, LOGOUT_ROUTES } from '@/utils/constants';
import React from 'react'
import { FiEdit2 } from 'react-icons/fi';
import { IoLogOut } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { TooltipWrapper } from '@/components/ToolTipWrapper';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';


const ProfileInfo = () => {
    const {userInfo, setUserInfo} = useAppStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTES,{},{withCredentials: true});
            if(response.data.success){
                toast.success("LogOut Successfull.");
                setUserInfo(null);
                navigate("/auth");
            }
        } catch (err){
            console.error(err);
            toast.error(err.response.data.error);
        }
    }

  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
        <div className="flex gap-3 items-center justify-center">
            <div className='w-12 h-12 relative' >
                <Avatar className="h-12 w-12 rounded-full overflow-hidden" >
                    {
                        userInfo.image ? 
                        <AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className="object-cover w-full h-full"/> :
                        (<div 
                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)} `}
                        >
                            {userInfo.name?userInfo.name.split("").shift():userInfo.email.split("").shift()}
                        </div>)
                    }
                </Avatar>
            </div>
            <div>
                {userInfo.name && `${userInfo.name}`}
            </div>
        </div>
        <div className="flex gap-5">
            <TooltipWrapper description={'Edit Profile'}>
                <FiEdit2 className='text-purple-500 text-xl font-medium' 
                            onClick={()=>navigate("/profile")}
                />
            </TooltipWrapper>
            <TooltipWrapper description={'Log Out'}>
                <IoLogOut className='text-purple-500 text-2xl font-medium' 
                    onClick={handleLogout}
                />
            </TooltipWrapper>
                        
            
        </div>
    </div>
  )
}

export default ProfileInfo