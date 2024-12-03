// import { axiosIntance } from "@/@core/utils/axiosInstance";
// import { Comments, Post, RegistrationFormInputs, Reply } from "@/@core/interfaces/Interface";

// // Registration API
// export const getRegistrationData = async () => {
//     const response = await axiosIntance?.get(`/registration`);
//     return response.data as RegistrationFormInputs[];
// };

// export const sendRegistrationData = async (data: RegistrationFormInputs) => {
//     const response = await axiosIntance?.post(`/registration`, data);
//     return response?.data;
// };

// export const updateUserData = async (data: RegistrationFormInputs) => {
//     await axiosIntance?.put(`/registration/${data?.id}`, data);
// };

// // Post API
// export const getPostData = async () => {
//     const response = await axiosIntance?.get(`/posts`);
//     return response.data as Post[];
// };

// export const sendPostData = async (data: Post) => {
//     const response = await axiosIntance?.post(`/posts`, data);
//     return response?.data;
// };

// export const updatePostData = async (data: Post) => {
//     await axiosIntance.put(`/posts/${data?.id}`, data);
// };

// // Comment API
// export const getCommentData = async () => {
//     const response = await axiosIntance?.get(`/comments`);
//     return response.data as Comments[];
// };

// export const sendCommentData = async (data: Comments) => {
//     const response = await axiosIntance?.post(`/comments`, data);
//     return response?.data;
// };

// export const updateCommentData = async (data: Comments) => {
//     await axiosIntance.put(`/comments/${data?.id}`, data);
// };

// // Comment Reply API

// export const getCommentReplyData = async () => {
//     const response = await axiosIntance?.get(`/commentreply`);
//     return response.data as Reply[];
// };

// export const sendCommentReplyData = async (data: Reply) => {
//     const response = await axiosIntance?.post(`/commentreply`, data);
//     return response?.data;
// };


import { axiosIntance } from "@/@core/utils/axiosInstance";
import { Comments, Post, RegistrationFormInputs, Reply } from "@/@core/interfaces/Interface";
import { socket } from "@/@core/utils/socket";

// Registration API
export const getRegistrationData = async () => {
    const response = await axiosIntance?.get(`/registration`);
    return response.data as RegistrationFormInputs[];
};

export const sendRegistrationData = async (data: RegistrationFormInputs) => {
    const response = await axiosIntance?.post(`/registration`, data);
    socket.emit('update-registration', response?.data);
    return response?.data;
};

export const updateUserData = async (data: RegistrationFormInputs) => {
    await axiosIntance?.put(`/registration/${data?.id}`, data);
    socket.emit('update-registration', data);
};

// Post API
export const getPostData = async () => {
    const response = await axiosIntance?.get(`/posts`);
    return response.data as Post[];
};

export const sendPostData = async (data: Post) => {
    const response = await axiosIntance?.post(`/posts`, data);
    socket.emit('newPost', response?.data);
    return response?.data;
};

export const updatePostData = async (data: Post) => {
    await axiosIntance.put(`/posts/${data?.id}`, data);
    // socket.emit('updatePost', data);
};

// Comment API
export const getCommentData = async () => {
    const response = await axiosIntance?.get(`/comments`);
    return response.data as Comments[];
};

export const sendCommentData = async (data: Comments) => {
    const response = await axiosIntance?.post(`/comments`, data);
    socket.emit('new-comment', response?.data);
    return response?.data;
};

export const updateCommentData = async (data: Comments) => {
    await axiosIntance.put(`/comments/${data?.id}`, data);
    socket.emit('update-comment', data);
};

// Comment Reply API
export const getCommentReplyData = async () => {
    const response = await axiosIntance?.get(`/commentreply`);
    return response.data as Reply[];
};

export const sendCommentReplyData = async (data: Reply) => {
    const response = await axiosIntance?.post(`/commentreply`, data);
    socket.emit('reply', response?.data);
    return response?.data;
};
