'use client'
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { redirect } from 'next/navigation';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from '@/components/dashboard/Navbar';
import { dataMutation, firstNameValidation, getData, lastNameValidation, passwordValidation, phoneValidation } from '@/components/CommonFunction';
import { getRegistrationData, updateUserData } from '@/api/api';
import { FormValues, RegistrationFormInputs } from '@/@core/interfaces/Interface';

const validationSchema = yup.object().shape({
    firstName: firstNameValidation,
    lastName: lastNameValidation,
    phone: phoneValidation,
    password: passwordValidation,
});

const UserProfile: React.FC = () => {

    const loginData: { email: string } = JSON.parse(localStorage?.getItem('loginData') as string);

    if (!loginData?.email) {
        redirect('/login');
    }

    const registrationData = getData('registration', getRegistrationData) as RegistrationFormInputs[];
    const updateUserDataMutation = dataMutation('registration', updateUserData);
    const currentUser: RegistrationFormInputs | undefined = registrationData?.find((user: RegistrationFormInputs) => user?.email === loginData?.email);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
    });

    const [imageSrc, setImageSrc] = useState<string | undefined>(currentUser?.imageSrc);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        if (currentUser) {
            setValue('firstName', currentUser?.firstName || '');
            setValue('lastName', currentUser?.lastName || '');
            setValue('password', currentUser?.password || '');
            setValue('phone', currentUser.phone?.toString() || '');
            setImageSrc(currentUser.imageSrc || '');
        }
    }, [currentUser, setValue]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        updateUserDataMutation?.mutate({ ...currentUser as any, ...data, imageSrc: imageSrc });
        toast.success('Data updated successfully!')
    };

    return (
        <div className='h-screen flex flex-col items-center bg-slate-100'>
            <Navbar />

            <form onSubmit={handleSubmit(onSubmit)} className='bg-white p-6 border-2 rounded-md flex flex-col w-2/4 my-5'>
                <div className='flex justify-between items-center mb-6 border-b-2'>
                    <div className='relative'>
                        <div className='h-16 w-16 border-2 rounded-full flex items-center justify-center my-3 relative overflow-hidden'>
                            {imageSrc ? (
                                <img src={imageSrc} alt='Profile' className='' />
                            ) : (
                                <span>{currentUser?.firstName?.charAt(0) || 'N'}</span>
                            )}
                        </div>
                        {isEdit && <label
                            className='absolute bottom-0 right-0 border-2 bg-white h-6 w-6 rounded-full text-xs text-center pt-1 text-zinc-500 cursor-pointer'
                            htmlFor='fileInput'
                        >
                            <FontAwesomeIcon icon={faPen} />
                        </label>}
                        <input
                            type='file'
                            id='fileInput'
                            className='hidden'
                            accept='image/*'
                            onChange={handleImageChange}
                        />
                    </div>
                    <button type='button' className='h-10 py-2 px-5 rounded-md bg-green-500 text-white' onClick={() => setIsEdit(!isEdit)}>{isEdit ? 'Cancel' : 'Edit'}</button>
                </div>

                <div className='flex space-x-4'>
                    <div className='flex flex-col w-2/4'>
                        <label className='text-slate-400'>First name</label>
                        {isEdit ? <input
                            {...register('firstName')}
                            className='border-2 p-1 rounded-md'
                            type='text'
                            placeholder='Enter your first name'
                        /> : <p className='font-semibold'>{currentUser?.firstName}</p>}
                        <p className='min-h-5 text-red-500 text-sm'>{errors.firstName?.message}</p>
                    </div>

                    <div className='flex flex-col w-2/4'>
                        <label className='text-slate-400'>Last name</label>
                        {isEdit ? <input
                            {...register('lastName')}
                            className='border-2 p-1 rounded-md'
                            type='text'
                            placeholder='Enter your last name'
                        /> : <p className='font-semibold'>{currentUser?.lastName}</p>}
                        <p className='min-h-5 text-red-500 text-sm'>{errors.lastName?.message}</p>
                    </div>
                </div>

                <label className='text-slate-400'>Email</label>
                <p className='font-semibold'>{currentUser?.email}</p>
                <p className='min-h-5 text-red-500 text-sm'></p>

                <label className='text-slate-400'>Phone No.</label>
                {isEdit ? <input
                    {...register('phone')}
                    className='border-2 p-1 rounded-md'
                    type='tel'
                    placeholder='Enter your phone number'
                    maxLength={10}
                    onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                    }}
                /> : <p className='font-semibold'>{currentUser?.phone}</p>}
                <p className='min-h-5 text-red-500 text-sm'>{errors.phone?.message}</p>

                <label className='text-slate-400'>Password</label>
                {isEdit ? <input
                    {...register('password')}
                    className='border-2 p-1 rounded-md'
                    type='password'
                    placeholder='Enter your password'
                /> : <p className='font-semibold'>{currentUser?.password}</p>}
                <p className='min-h-5 text-red-500 text-sm'>{errors.password?.message}</p>

                <div className='text-end py-3 border-t-2'>
                    <button type='submit' className='h-10 py-2 px-5 rounded-md bg-sky-500 text-white'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default UserProfile;

