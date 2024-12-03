import { RegistrationFormInputs } from '@/@core/interfaces/Interface';
import { getRegistrationData } from '@/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';

export const getData = (queryKey: string, queryFn: any) => {
    const { data } = useQuery({
        queryKey: [queryKey],
        queryFn,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return data;
};

export const dataMutation = (queryKey: string, queryFn: any) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: queryFn,
        onSuccess: () => {
            queryClient.invalidateQueries(queryKey as any);
        },
    });

    return mutation;
};

export const currentUserData = () => {
    const registrationData = getData('registration', getRegistrationData) as RegistrationFormInputs[];
    const loginData: { email: string } = JSON.parse(localStorage?.getItem('loginData') as string);
    const currentUser: RegistrationFormInputs | undefined = registrationData?.find((user: RegistrationFormInputs) => user?.email === loginData?.email);
    return currentUser;
}


export const firstNameValidation: yup.StringSchema<string, yup.AnyObject, undefined, ''> = yup.string().required('First Name is required');

export const lastNameValidation: yup.StringSchema<string, yup.AnyObject, undefined, ''> = yup.string().required('Last Name is required');

export const emailValidation: yup.StringSchema<string, yup.AnyObject, undefined, ''> = yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .matches(/^[a-z0-9]+@[a-z0-9]+\.[a-zA-Z]{2,4}$/, 'Invalid email format');

export const passwordValidation: yup.StringSchema<string, yup.AnyObject, undefined, ''> = yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':'\\|,.<>\/?]).*$/,
        'Password must be strong.'
    );

export const phoneValidation: yup.StringSchema<string, yup.AnyObject, undefined, ''> = yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only numbers")
    .min(10, "Phone number must be at least 10 digits")
    .required('Phone number is required')