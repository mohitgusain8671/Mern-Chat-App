import Logo from '@/components/Logo'
import Title from '@/components/Title'
import React from 'react'
import ProfileInfo from '../components/ProfileInfo'

const ContactContainer = () => {
  return (
    <div className='z-2 relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full '>
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text='Direct Messages' />
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