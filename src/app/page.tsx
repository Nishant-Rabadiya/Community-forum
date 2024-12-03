'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import FromElement from '@/components/formElements/FromElement';
import { registrationSchema } from '@/components/formElements/formSchema';
import { RegistrationFormInputs } from '@/@core/interfaces/Interface';
import { dataMutation, getData } from '@/components/CommonFunction';
import { getRegistrationData, sendRegistrationData } from '@/api/api';

const Registration: React.FC = () => {
  const loginData: { email: string } = JSON.parse(localStorage?.getItem('loginData') as string);

  if (loginData?.email) {
    redirect('/dashboard');
  }

  const registrationData = getData('registration', getRegistrationData) as RegistrationFormInputs[];
  const mutation = dataMutation('registration', sendRegistrationData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormInputs | any>({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = (data: RegistrationFormInputs) => {
    if (registrationData?.find((email: RegistrationFormInputs) => email?.email === data?.email)) {
      toast?.error('Email must be unique!');
      return;
    } else {
      toast?.success('Registration successfully!');
      mutation?.mutate(data as any);
      redirect('/login');
    }
  };

  return (
    <div className='flex justify-center p-5 '>
      <div className='border-2 w-2/4 p-3 bg-slate-100 rounded-md'>
        <h1 className='text-4xl text-center'>Registration</h1>
        <form onSubmit={handleSubmit(onSubmit)}>

          <FromElement title='First name:' data={{ ...register('firstName') }} placeholder='Enter your First name!' error={errors?.firstName?.message} />

          <FromElement title='Last name:' data={{ ...register('lastName') }} placeholder='Enter your Last name!' error={errors?.lastName?.message} />

          <FromElement title='Email:' data={{ ...register('email') }} placeholder='Enter your Email!' error={errors?.email?.message} />

          <FromElement title='Password:' data={{ ...register('password') }} placeholder='Enter your Password!' error={errors?.password?.message} />

          <div className='mb-4'>
            <label className='block text-gray-700'>Role:</label>
            <select
              {...register('role')}
              className='w-full p-2 border rounded-md'
            >
              <option value='Member'>Member</option>
              <option value='Moderator'>Moderator</option>
              <option value='Admin'>Admin</option>
            </select>
          </div>

          <div className='text-center m-2'>
            <button
              type='submit'
              className='w-3/4 p-2 rounded p-1 bg-sky-400 text-white'
            >
              Submit
            </button>
            <p>
              Already have an account? {' '}
                <Link href='/login' className='text-cyan-500 underline hover:underline-offset-4'>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;



