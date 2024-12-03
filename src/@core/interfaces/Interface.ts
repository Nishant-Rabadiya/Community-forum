export interface RegistrationFormInputs {
    id: string
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    phone?: number;
    imageSrc?: string;
    restrict?: false
}

export interface LoginFormInputs {
    email: string;
    password: string;
}

export interface Post {
    like?: any,
    id: string,
    postDiscription?: string,
    postImageSrc?: string,
    userId: string,
    date: number,
    deletePost?: boolean,
    reportedBy?:any,
    restrict?: false
}

export interface Comments {
    id: string,
    postId: string,
    comment: string,
    userId?: string,
    date: number
}

export interface Reply {
    id: string
    postId: string,
    commnetId: string,
    reply: string,
    userId?: string,
    date: number
}

export interface FormValues {
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    imageSrc?: string;
};