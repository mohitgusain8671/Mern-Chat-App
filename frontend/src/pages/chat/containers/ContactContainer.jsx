import Logo from '@/components/Logo'
import Title from '@/components/Title'
import React, { useEffect } from 'react'
import ProfileInfo from '../components/ProfileInfo'
import ChatItem from '../components/ChatItem'
import AddNewDm from '../components/AddNewDm'
import { apiClient } from '@/lib/api-client.js'
import { GET_DM_CONTACTS } from '@/utils/constants.js'
import { toast } from 'sonner'
import { useAppStore } from '@/store'
import ContactList from '../components/ContactList'

const ContactContainer = () => {
  const { setDMContacts, dmContacts } = useAppStore();
  useEffect(()=>{
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS,{ withCredentials: true });
      if(response.status===200){
        setDMContacts(response.data.contacts);
      } else{
        toast.error("Error Fetching Contacts");
      }
    }
    getContacts();
  },[])
  return (
    <div className='relative md:w-[40vw] lg:w-[35vw] xl:w-[25vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text='Direct Messages' />
          <AddNewDm />
        </div>
        <div className='max-h-[38dvh] overflow-y-auto no-scrollbar'>
          <ContactList contacts={dmContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text='Channels' />
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactContainer