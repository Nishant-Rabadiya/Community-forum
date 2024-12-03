import React from 'react';
import { currentUserData } from '../CommonFunction';

const UserDetailsAndCategories = () => {
    const currentUser = currentUserData();

    return (
        <div className='w-1/5 p-3 rounded-lg bg-white'>
            <div className='relative'>
                <div className='bg-zinc-300 h-16 '>

                </div>
                <div className='flex justify-center'>
                    <p className='absolute top-1/2 bg-white w-16 h-16 overflow-hidden border rounded-full flex items-center justify-center'>
                        {currentUser?.imageSrc ? <img src={currentUser?.imageSrc} alt="user image" /> : currentUser?.firstName?.charAt(0)}
                    </p>

                </div>
            </div>
            <div className='mt-10 pb-4 text-center border-b'>
                <p className='font-semibold'>{currentUser?.firstName + " " + currentUser?.lastName}</p>
                <p className='text-sm text-slate-500'>{currentUser?.email}</p>
                <p className='text-sm text-slate-500'>{currentUser?.role}</p>
            </div>

            <div className='my-4 border-b pb-4'>
                <p className='font-semibold'>Categories</p>
                <ul className='pl-6'>
                    <li className='text-sm list-disc cursor-pointer'>General Discussion</li>
                    <li className='text-sm list-disc cursor-pointer'>Help</li>
                    <li className='text-sm list-disc cursor-pointer'>News</li>
                </ul>
            </div>
        </div>
    )
}

export default UserDetailsAndCategories;
