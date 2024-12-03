'use client'
import React, { useState } from 'react';
import { redirect } from 'next/navigation';
import { RegistrationFormInputs } from '@/@core/interfaces/Interface';
import { getRegistrationData } from '@/api/api';
import { getData } from '@/components/CommonFunction';
import Navbar from '@/components/dashboard/Navbar';
import Posts from '@/components/dashboard/Posts';
import UserDetailsAndCategories from '@/components/dashboard/UserDetailsAndCategories';
import PostModal from '@/components/PostModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const loginData: { email: string } = JSON.parse(localStorage?.getItem('loginData') as string);

  if (!loginData?.email) {
    redirect('/login');
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const registrationData = getData('registration', getRegistrationData) as RegistrationFormInputs[];
  const currentUser: RegistrationFormInputs | undefined = registrationData?.find((user: RegistrationFormInputs) => user?.email === loginData?.email);

  return (
    <>
      <div className='bg-neutral-100 h-screen'>
        <Navbar />
        <div className='flex justify-center gap-4 mt-4 h-[619px] overflow-auto'>
          <UserDetailsAndCategories />

          <div className='w-2/5'>
            <div className='flex bg-white rounded-lg px-4 py-7'>
              <p className='h-12 w-12 border-2 rounded-full mr-3 flex items-center justify-center overflow-hidden'>{currentUser?.imageSrc ? <img src={currentUser?.imageSrc} alt="Profile" /> : currentUser?.firstName?.charAt(0)}</p>

              <button onClick={openModal} className='w-4/5 text-start border-2 rounded-full hover:bg-gray-100 px-3 py-2'>Start a post, Start writing...</button>
            </div>

            <Posts />

          </div>
        </div>
      </div>
      <PostModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default Dashboard;




