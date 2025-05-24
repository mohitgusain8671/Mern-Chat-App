import { TooltipWrapper } from '@/components/ToolTipWrapper';
import { useAppStore } from '@/store';
import React, { useEffect, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi';
import { IoTrashBin } from "react-icons/io5";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MultipleSelector from '@/components/ui/multipleselect';
import { apiClient } from '@/lib/api-client';
import { DELETE_CHANNEL, GET_ALL_CONTACTS, UPDATE_CHANNEL } from '@/utils/constants';
import { toast } from 'sonner';

const UpdateChannelnfo = ({contact}) => {
    const {
        selectedChatData,
        setSelectedChatData,
        selectedChatType,
        setSelectedChatType,
        setSelectedChatMessages,
        removeChannelInChannelList,
        UpdateChannelInfo
    } = useAppStore();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [channelName, setChannelName] = useState(contact.name);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedChannelMembers, setSelectedChannelMembers] = useState(contact.members);

    useEffect(()=>{
        const getData = async ()=>{
            const res = await apiClient.get(GET_ALL_CONTACTS,{withCredentials: true});
            setAllContacts(res.data.contacts);
        }
        const members = selectedChannelMembers.map(user=>({
            _id: user._id,
            label: user.name,
            email: user.email,
            value: user._id
        }));
        setSelectedChannelMembers(members);
        getData();
    },[]);
    const handleEdit = async () => {
        try {
            const res = await apiClient.put(UPDATE_CHANNEL,{
                channelId: contact._id,
                name: channelName,
                members: selectedChannelMembers.map((contact)=>contact.value)
            },{withCredentials: true});
            if(res.status===200){
                toast.success('Channel updated successfully! Refresh to see changes.');
                UpdateChannelInfo(res.data.channel);
                if( selectedChatType === 'channel' && selectedChatData._id === contact._id ){
                    setSelectedChatData(res.data.channel);
                }
                setShowEditModal(false);
            }

        } catch(err){
            console.log(err);
        }
    }
    const handleDelete = async () => {
        try{
            const res = await apiClient.delete(DELETE_CHANNEL,{
                withCredentials: true,
                data: { channelId: contact._id }
            });
            if(res.status===200){
                setShowDeleteModal(false);
                removeChannelInChannelList(contact);
                if(selectedChatData && selectedChatData._id===contact._id){
                    setSelectedChatData(null);
                    setSelectedChatType(undefined);
                    setSelectedChatMessages([]);
                }
                toast.success(`${contact.name} Channel is Deleted Successfully! Refresh the page to see the changes.`)
            }

        } catch(err){
            console.log(err);
        }
    }
  return (
    <div className="flex gap-3">
        <TooltipWrapper description={'Edit Channel'}>
            <FiEdit2 
                className={`text-lg ${selectedChatData && selectedChatData._id === contact._id? 'text-white/70 ': 'text-neutral-400/50'} hover:text-white`} 
                onClick={(e) => {
                    e.stopPropagation();
                    setShowEditModal(true);
                }}
            />
        </TooltipWrapper>
        <TooltipWrapper description={'Delete Channel'}>
            <IoTrashBin 
                className={`text-lg ${selectedChatData && selectedChatData._id === contact._id? 'text-white/70 ': 'text-neutral-400/90'} hover:text-white`} 
                onClick={(e)=>{
                    e.stopPropagation();
                    setShowDeleteModal(true);
                }}
            />
        </TooltipWrapper>
        {/* DELETE CHANNEL DIALOG */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal} >
            <DialogContent className='bg-[#181920] border-none text-white w-[300px] flex flex-col' >
                <DialogHeader>
                    <DialogTitle className='text-center'>{`Delete ${contact.name}`}</DialogTitle>
                    <DialogDescription className='text-center' >All Messages would be deleted too</DialogDescription>
                </DialogHeader>
                <div className='w-full flex items-center justify-center gap-10'>
                    <Button className='bg-violet-600/80 hover:bg-violet-600/30' onClick={(e)=>{
                        e.stopPropagation();
                        handleDelete();
                    }}>Yes</Button>
                    <Button className='bg-violet-600/80 hover:bg-violet-600/30' onClick={(e)=>{
                        e.stopPropagation();
                        setShowDeleteModal(false);
                    }} >No</Button>
                </div>
            </DialogContent>
        </Dialog>
        {/* EDIT CHANNEL DIALOG */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal} >
            <DialogContent className='bg-[#181920] border-none text-white w-[380px] flex flex-col' >
                <DialogHeader>
                    <DialogTitle className='text-center'>{`Edit ${contact.name} Details`}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <label className='p-2 text-lg text-white/70'>Channel Name</label>
                    <Input
                        placeholder=""
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        className="p-6 border-none text-white bg-[#2c2e3b] rounded-lg mt-2"
                    />
                </div>
                <div>
                    <label className='p-2 text-lg text-white/70'>Channel Name</label>
                    <MultipleSelector
                        className='rounded-lg border-none bg-[#2c2e3b] py-2 text-white'
                        defaultOptions={allContacts}
                        placeholder="Select Contacts"
                        value={selectedChannelMembers}
                        onChange={setSelectedChannelMembers}
                        emptyIndicator = {
                            <p className='text-center text-lg leading-10 text-gray-600'>No Result Found</p>
                        }
                    />
                </div>
                <div className='w-full flex items-center justify-center gap-10'>
                    <Button className='bg-violet-600/80 hover:bg-violet-600/30 w-full' onClick={(e)=>{
                        e.stopPropagation();
                        handleEdit();
                    }}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>

    </div>
  )
}

export default UpdateChannelnfo