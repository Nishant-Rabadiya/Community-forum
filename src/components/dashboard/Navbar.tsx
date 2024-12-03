'use client'
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { currentUserData } from '../CommonFunction';
import { RegistrationFormInputs } from '@/@core/interfaces/Interface';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const currentUser: RegistrationFormInputs | undefined = currentUserData();

    const handleLogoutButton = (): void => {
        localStorage.setItem('loginData', JSON.stringify({ email: '' }));
        toast.success('Logout successfully');
        redirect('/login');
    }

    return (
        <div className='bg-white w-full flex justify-between items-center border-2 px-5 py-2 relative'>
            <h1 className='text-2xl font-semibold cursor-pointer' onClick={() => redirect('/dashboard')}>Home</h1>
            <button className='border-2 h-10 w-10 rounded-full overflow-hidden' onClick={() => setIsOpen(!isOpen)}>{currentUser?.imageSrc ?<img src={currentUser?.imageSrc} alt='Profile'/> : currentUser?.firstName?.charAt(0)}</button>

            {isOpen &&
                <div className='absolute bg-white border-2 rounded-md right-7 top-12'>
                    <ul className=''>
                        <li className='border-2 py-1 px-5 cursor-pointer hover:bg-slate-200' onClick={() => redirect('/user-profile')}>Profile</li>
                        <li className='border-2 py-1 px-5 cursor-pointer hover:bg-slate-200' onClick={handleLogoutButton}>Logout</li>
                    </ul>
                </div>}
        </div>
    )
}

export default Navbar;
