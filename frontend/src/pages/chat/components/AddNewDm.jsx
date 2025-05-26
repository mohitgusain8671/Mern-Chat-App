import React, { useEffect, useState } from 'react'
import { TooltipWrapper } from '@/components/ToolTipWrapper'
import { FaPlus } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import Lottie from 'react-lottie'
import { animationDefault, getColor } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiClient } from '@/lib/api-client'
import { HOST, SEARCH_CONTACTS } from '@/utils/constants'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useAppStore } from '@/store'

const AddNewDm = () => {

    const { setSelectedChatType, setSelectedChatData } = useAppStore();

    const [openNewContactModel, setOpenNewewContactModel] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const [isChrome, setIsChrome] = useState(false);

    useEffect(() => {
        const isChromeBrowser =
        /Chrome/.test(navigator.userAgent) &&
        !/Edg/.test(navigator.userAgent) &&
        !/OPR/.test(navigator.userAgent); // exclude Edge and Opera
        setIsChrome(isChromeBrowser);
    }, []);

    const searchContacts = async (searchQuery) => {
        try {
            if(searchQuery.length>0){
                const response = await apiClient.post(SEARCH_CONTACTS,
                    { searchTerm: searchQuery },
                    { withCredentials: true }
                );
                if(response.status===200) {
                    setSearchedContacts(response.data.contacts);
                }
            } else {
                setSearchedContacts([]);
            }
        } catch(err){
            console.error(err);
        }
    }

    const selectNewContact = (contact) => {
        setOpenNewewContactModel(false);
        setSelectedChatType('contact');
        setSelectedChatData(contact);
        setSearchedContacts([]);
    }

  return (
    <>
        <TooltipWrapper description="Add New Friend">
            <FaPlus
                className="text-sm text-neutral-400/90 font-light hover:text-neutral-100 cursor-pointer transition-all duration-300"
                onClick={()=>setOpenNewewContactModel(true)}
            />
        </TooltipWrapper>
        <Dialog open={openNewContactModel} onOpenChange={setOpenNewewContactModel} >
            <DialogContent className={`bg-[#181920] border-none text-white w-[400px] flex flex-col ${isChrome ? 'chrome-dialog' : ''}`} >
                <DialogHeader>
                    <DialogTitle>Add New Friend</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Input 
                        placeholder="Search "
                        className="p-6 border-none text-white bg-[#2c2e3b] rounded-lg"
                        onChange={(e)=>searchContacts(e.target.value)}
                    />
                </div>
                {
                    searchedContacts.length<=0 ? 
                    <div className="flex-1 mt-5 md:flex flex-col justify-center items-center duration-1000 transition-all p-6" >
                        <Lottie
                            isClickToPauseDisabled={true}
                            height={100}
                            width={100}
                            options={animationDefault}
                        />
                        <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center ">
                            <h3 className="poppins-medium">
                            Hi<span className="text-purple-500">!</span> Search New
                            <span className="text-purple-500"> Friends </span>
                            </h3>
                        </div>
                    </div> :
                    <ScrollArea className='h-[250px]'>
                        <div className='flex flex-col gap-5' >
                            {
                                searchedContacts.map((contact) => (
                                    <div key={contact._id} className='flex gap-3 items-center cursor-pointer' onClick={()=>selectNewContact(contact)}
                                    >
                                        <div className='w-12 h-12 relative' >
                                            <Avatar className="h-12 w-12 rounded-full overflow-hidden" >
                                                {
                                                    contact.image ? 
                                                    <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full"/> :
                                                    (<div 
                                                        className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)} `}
                                                    >
                                                        {contact.name?contact.name.split("").shift():contact.email.split("").shift()}
                                                    </div>)
                                                }
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col ml-2 mb-1">
                                            <span>{contact.name ? contact.name: contact.email }</span>
                                            <span className='text-xs' >{contact.email}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    </ScrollArea>
                }
            </DialogContent>
        </Dialog>
    </>
  )
}

export default AddNewDm