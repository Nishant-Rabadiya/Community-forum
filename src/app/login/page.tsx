'use client'
import React from 'react';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FromElement from '@/components/formElements/FromElement';
import { loginSchema } from '@/components/formElements/formSchema';
import { LoginFormInputs, RegistrationFormInputs } from '@/@core/interfaces/Interface';
import { getData } from '@/components/CommonFunction';
import { getRegistrationData } from '@/api/api';
import Link from 'next/link';

const Login: React.FC = () => {
  const loginData: { email: string } = JSON.parse(localStorage?.getItem('loginData') as string);

  if (loginData?.email) {
    redirect('/dashboard');
  }

  const registrationData = getData('registration', getRegistrationData) as RegistrationFormInputs[];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    const currentUser: RegistrationFormInputs | undefined = registrationData?.find((user: RegistrationFormInputs) => user?.email === data?.email && user?.password === data?.password);
    if (!(currentUser)) {
      toast.error(`Email or password dosn't match!`);
    } else {
      localStorage.setItem('loginData', JSON.stringify({ email: data?.email }));
      toast.success('Login successfully !');
      redirect('/dashboard');
    }
  };

  return (
    <>
      <div className='flex justify-center p-5'>
        <div className='border-2 w-2/4 p-3 bg-slate-100 rounded-md'>
          <h1 className='text-4xl text-center'>Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>

            <FromElement title='Email:' data={{ ...register('email') }} placeholder='Enter your Email!' error={errors?.email?.message} />

            <FromElement title='Password:' data={{ ...register('password') }} placeholder='Enter your Password!' error={errors?.password?.message} />

            <div className='text-center m-2'>
              <button type='submit' className='w-3/4 p-2 rounded p-1 bg-sky-400 text-white'>
                Login
              </button>
              <p>
                No account?{' '}
                <Link href='/' className='text-cyan-500 underline hover:underline-offset-4'>
                  Registration
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
