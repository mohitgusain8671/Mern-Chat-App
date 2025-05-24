import React, { useEffect, useState } from 'react'
import { TooltipWrapper } from '@/components/ToolTipWrapper'
import { FaPlus } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiClient } from '@/lib/api-client'
import { CREATE_CHANNEL, GET_ALL_CONTACTS } from '@/utils/constants'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import MultipleSelector from '@/components/ui/multipleselect'
import { toast } from 'sonner'

const CreateChannel = () => {

    const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();

    const [newChannelModel, setNewChannelModel] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [ChannelName, setChannelName] = useState('')

    useEffect(()=>{
        const getData = async ()=>{
            const res = await apiClient.get(GET_ALL_CONTACTS,{withCredentials: true});
            setAllContacts(res.data.contacts);
        }
        getData();
    },[]);

    const validateCreateChannel = ()=> {
        if(ChannelName.trim() === '') {
            toast.error('Please enter channel name');
            return false;
        }
        if(selectedContacts.length===0) {
            toast.error('Please select at least one contact');
            return false;
        }
        return true;
    }

    const createChannel = async ()=> {
        if(validateCreateChannel()){
            try{    
                const res = await apiClient.post(CREATE_CHANNEL,{
                    name: ChannelName,
                    members: selectedContacts.map((contact)=>contact.value),
                }, {withCredentials: true});
                if(res.status===201) {
                    addChannel(res.data.channel);
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModel(false);
                    toast.success('Channel created successfully');
                }
            } catch(error){
                console.log(error);
                toast.error(error.response.data.error);
            }
        }
    }


  return (
    <>
        <TooltipWrapper description="Create New Channel">
            <FaPlus
                className="text-sm text-neutral-400/90 font-light hover:text-neutral-100 cursor-pointer transition-all duration-300"
                onClick={()=>setNewChannelModel(true)}
            />
        </TooltipWrapper>
        <Dialog open={newChannelModel} onOpenChange={setNewChannelModel} >
            <DialogContent className='bg-[#181920] border-none text-white w-[400px] flex flex-col' >
                <DialogHeader>
                    <DialogTitle>Fill Details to Create New Channel</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Input 
                        placeholder="Channel Name"
                        className="p-6 border-none text-white bg-[#2c2e3b] rounded-lg"
                        onChange={(e)=>setChannelName(e.target.value)}
                        value={ChannelName}
                    />
                </div>
                <div>
                    <MultipleSelector
                        className='rounded-lg border-none bg-[#2c2e3b] py-2 text-white'
                        defaultOptions={allContacts}
                        placeholder="Select Contacts"
                        value={selectedContacts}
                        onChange={setSelectedContacts}
                        emptyIndicator = {
                            <p className='text-center text-lg leading-10 text-gray-600'>No Result Found</p>
                        }
                    />
                </div>
                <div>
                    <Button className='w-full bg-purple-700 p-5 text-lg hover:bg-purple-900 transition-all duration-300'
                    onClick={createChannel}
                    >Create Channel</Button>
                </div>
                
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CreateChannel