import { TooltipWrapper } from '@/components/ToolTipWrapper';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { DELETE_CONTACT, HOST } from '@/utils/constants';
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AiOutlineUserDelete } from "react-icons/ai";
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import UpdateChannelnfo from './UpdateChannelnfo';

const ContactList = ({ contacts, isChannel = false}) => {
    const [openDeleteContactModel, setOpenDeleteContactModel] = useState(false);
    const { 
        selectedChatType,
        selectedChatData, 
        setSelectedChatData, 
        setSelectedChatType,
        setSelectedChatMessages,
        removeContactinDMContacts,
        userInfo
    } = useAppStore();
    const handleClick = (contact) => {
        if(isChannel) setSelectedChatType('channel');
        else setSelectedChatType('contact');
        setSelectedChatData(contact);
        if(selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
    }
    const handleDeleteUser = async (contact) => {
        try {
            const res = await apiClient.delete(DELETE_CONTACT, {
                withCredentials: true,
                data: { contactId: contact._id },
            });
            if(res.status === 200) {
                setOpenDeleteContactModel(false);
                removeContactinDMContacts(contact);
                if(selectedChatData && selectedChatData._id===contact._id){
                    setSelectedChatData(null);
                    setSelectedChatType(undefined);
                    setSelectedChatMessages([]);
                }
                toast.success(`${contact.name? contact.name : contact.email} deleted successfully! Refresh the page to see the changes.`);
            }
        } catch (err){
            console.error(err);
        }
    }
  return (
    <div className='mt-5' >{
        contacts.map((contact)=>(
            <div 
                key={contact._id} 
                className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? 'bg-[#8417ff] hover:bg-[#8317fff0]' : 'hover:bg-[#f1f1f111]'} flex justify-between pr-8 items-center`} 
                onClick={()=> handleClick(contact)}
            >
                
                <div className="flex gap-5 items-center justify-start text-neutral-300">
                    {
                        !isChannel && <Avatar className="w-10 h-10 rounded-full overflow-hidden" >
                            {
                                contact.image ? 
                                <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full"/> :
                                (<div 
                                    className={`${selectedChatData && selectedChatData._id=== contact._id?"bg-[#ffffff22] border border-white/70":getColor(contact.color)} uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}
                                >
                                    {contact.name?contact.name.split("").shift():contact.email.split("").shift()}
                                </div>)
                            }
                        </Avatar>   
                    }
                    { isChannel && <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ' >#</div> }
                    { isChannel 
                    ? <span> {contact.name} </span> 
                    :<TooltipWrapper description={`USER-BIO: ${contact.bio}`} > 
                        <span>{(contact.name ? contact.name : contact.email )}</span>
                    </TooltipWrapper>
                    }
                </div>
                {
                    !isChannel &&(<>
                    <div className={`text-lg ${selectedChatData && selectedChatData._id === contact._id? 'text-white/70': 'text-gray-500/50'}`} onClick={(e)=>{
                        e.stopPropagation()
                        setOpenDeleteContactModel(true)
                    }}>
                        <TooltipWrapper description='Delete User' >
                            <AiOutlineUserDelete />
                        </TooltipWrapper>
                    </div>
                    <Dialog open={openDeleteContactModel} onOpenChange={setOpenDeleteContactModel} >
                        <DialogContent className='bg-[#181920] border-none text-white w-[300px] flex flex-col' >
                            <DialogHeader>
                                <DialogTitle className='text-center'>{`Delete ${(contact.name ? contact.name : contact.email )}`}</DialogTitle>
                                <DialogDescription className='text-center' >All Messages would be deleted</DialogDescription>
                            </DialogHeader>
                            <div className='w-full flex items-center justify-center gap-10'>
                                <Button className='bg-violet-600/80 hover:bg-violet-600/30' onClick={(e)=>{
                                    e.stopPropagation()

                                    handleDeleteUser(contact)
                                }}>Yes</Button>
                                <Button className='bg-violet-600/80 hover:bg-violet-600/30' onClick={(e)=>{
                                    e.stopPropagation()
                                    setOpenDeleteContactModel(false);
                                }} >No</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    </>)
                }
                {
                    (isChannel && contact.admin._id === userInfo._id) && (
                        <UpdateChannelnfo contact={contact} />
                    )
                }
            </div>
        ))
    }</div>
  )
}

export default ContactList