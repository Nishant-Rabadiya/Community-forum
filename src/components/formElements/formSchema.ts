import * as yup from 'yup';
import { emailValidation, firstNameValidation, lastNameValidation, passwordValidation } from '../CommonFunction';

export const loginSchema = yup.object().shape({
    email: emailValidation,
    password: passwordValidation,
});

export const registrationSchema = yup.object().shape({
    firstName: firstNameValidation,
    lastName: lastNameValidation,
    email: emailValidation,
    password: passwordValidation,
});