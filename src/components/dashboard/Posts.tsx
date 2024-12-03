import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { faCommentDots, faPaperPlane, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '@/@core/utils/socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { currentUserData, dataMutation, getData } from '../CommonFunction';
import { getCommentData, getCommentReplyData, getPostData, getRegistrationData, sendCommentData, sendCommentReplyData, updatePostData, updateUserData } from '@/api/api';
import { Comments, Post, RegistrationFormInputs, Reply } from '@/@core/interfaces/Interface';


const Posts = () => {
    const queryClient = useQueryClient();

    const [postData, setPostData] = useState<Post[]>([]);
    const [commentData, setCommentData] = useState<string>('');
    const [replyCommentData, setReplyCommentData] = useState<string>('');
    const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<string | null>(null);
    const [activePostForComments, setActivePostForComments] = useState<string | null>(null);

    const currentUser: RegistrationFormInputs | undefined = currentUserData();
    const registrationData = getData('registration', getRegistrationData) as RegistrationFormInputs[];
    const updateUserMutation = dataMutation('registration', updateUserData);

    const postsData = getData('posts', getPostData) as Post[];
    const updatePostsMutation = dataMutation('post', updatePostData);

    const commentsData = getData('comment', getCommentData) as Comments[];
    const commentMutation = dataMutation('comment', sendCommentData);

    const commentReplyData = getData('reply', getCommentReplyData) as Reply[];
    const commentReplyMutation = dataMutation('reply', sendCommentReplyData);



    const handleSendCommentButton = (id: string) => {
        const comment = {
            postId: id,
            comment: commentData,
            userId: currentUser?.id,
            date: Date.now(),
        }
        if (commentData) {
            commentMutation.mutate(comment as any);
            toast.success('Comment added successfully');
            setCommentData('');
        }
    };

    const handlePostLikeButton = (postData: any) => {
        const post = postsData?.find((post: Post) => post?.id === postData?.id) as Post;
        if (post) {
            const likes = Array.isArray(post?.like) ? post?.like : [];
            const hasLiked: boolean = likes.includes(currentUser?.id);

            const updatedLikes = hasLiked
                ? likes.filter((userId: string) => userId !== currentUser?.id)
                : [...likes, currentUser?.id];

            updatePostsMutation.mutate({ ...post as any, like: updatedLikes });
        }
    };

    const handleSendReplyButton = (commnetId: string, postId: string) => {
        const reply = {
            postId: postId,
            commnetId: commnetId,
            reply: replyCommentData,
            userId: currentUser?.id,
            date: Date.now(),
        }
        if (replyCommentData) {
            commentReplyMutation.mutate(reply as any);
            toast.success('Comment reply added successfully');
            setReplyCommentData('');
            setReplyCommentId('');
        }
    };

    const handleDeletePostButton = (post: Post) => {
        const confirmMessage: boolean = window.confirm('Are you sure! You want to delete this post?');
        if (confirmMessage) {
            updatePostsMutation.mutate({ ...post as any, deletePost: true });
            toast.success('Post deleted successfully');
        }
    };

    const handleRestrictButton = (post: Post) => {
        const restrictUser: RegistrationFormInputs | undefined = registrationData?.find((user: RegistrationFormInputs) => user?.id === post?.userId);
        const confirmMessage: boolean = window.confirm('Are you sure! You want to restrict this post?');
        if (confirmMessage) {
            updatePostsMutation.mutate({ ...post as any, restrict: true });
            updateUserMutation.mutate({ ...restrictUser as any, restrict: true })
            toast.success('Post restricted successfully');
        }
    };

    const handleReportPostButton = (postData: Post) => {
        const confirmMessage: boolean = window.confirm('Are you sure you want to report this post?');
        if (confirmMessage) {
            const post = postsData?.find((post: Post) => post?.id === postData?.id);
            if (post) {
                const reportedBy = Array.isArray(post?.reportedBy) ? post.reportedBy : [];
                const hasReported: boolean = reportedBy.includes(currentUser?.id);

                const updatedReportedBy = hasReported
                    ? reportedBy.filter((userId: string) => userId !== currentUser?.id)
                    : [...reportedBy, currentUser?.id];

                updatePostsMutation.mutate({ ...post as any, reportedBy: updatedReportedBy });
                toast.success(hasReported ? 'Report removed' : 'Post reported successfully');
            }
        }
    };

    useEffect(() => {
        const filteredPosts = postsData
            ?.filter((post: Post) => {
                const postUser = registrationData?.find((user: RegistrationFormInputs) => user?.id === post?.userId) as RegistrationFormInputs;
                return !post.deletePost && !(postUser?.restrict);
            })?.reverse();
        setPostData(filteredPosts);
    }, [postsData, registrationData]);


    useEffect(() => {
        socket.on('newPost', (post) => {
            queryClient.setQueryData(['posts'], (oldPosts: Post[] | undefined) => [
                ...(oldPosts || []),
                post,
            ]);
        });

        socket.on('new-comment', (post) => {
            queryClient.setQueryData(['comment'], (oldPosts: Comments[] | undefined) => [
                ...(oldPosts || []),
                post,
            ]);
        });
        socket.on('reply', (post) => {
            queryClient.setQueryData(['reply'], (oldPosts: Reply[] | undefined) => [
                ...(oldPosts || []),
                post,
            ]);
        });

        return () => {
            socket.off('newPost');
            socket.off('new-comment');
            socket.off('reply');
        };
    }, [queryClient]);

    return (
        <>
            {postData?.map((post: Post) => {
                const postUser = registrationData?.find((user: RegistrationFormInputs) => user?.id === post?.userId) as RegistrationFormInputs;
                const postComments = commentsData?.filter((comment: Comments) => comment?.postId === post?.id).reverse() as Comments[];
                return (
                    <div key={post?.id} className='relative mt-4 bg-white rounded-lg p-3'>
                        <div className='flex justify-between'>
                            <div className='flex items-center pb-3'>
                                <p className='h-12 w-12 border-2 rounded-full mr-3 flex items-center justify-center overflow-hidden'>{postUser?.imageSrc ? <img src={postUser?.imageSrc} alt='Profile' /> : <span>{postUser?.firstName?.charAt(0)}</span>}</p>
                                <div>
                                    <p className='font-semibold'>{postUser?.firstName + ' ' + postUser?.lastName}</p>
                                    <span className='text-sm text-slate-400'>{postUser?.role}</span>
                                </div>
                            </div>
                            <button className='' onClick={() => setIsOpen((prev) => (prev === post?.id ? null : post?.id))}><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                            <div className='absolute bg-white border-2 rounded-md right-0 top-14'>
                                {isOpen === post?.id &&
                                    (() => {
                                        if (currentUser?.role === 'Member') {
                                            return (
                                                <ul className=''>
                                                    {currentUser?.id === post?.userId ?
                                                        <li className='border-2 py-1 px-5 cursor-pointer hover:bg-slate-200' onClick={() => handleDeletePostButton(post)}>Delete</li>
                                                        :
                                                        <li className='border-2 py-1 px-5 cursor-pointer hover:bg-slate-200' onClick={() => handleReportPostButton(post)}>Report</li>
                                                    }
                                                </ul>
                                            );
                                        } else if (currentUser?.role === 'Moderator' || currentUser?.role === 'Admin') {
                                            return (
                                                <ul className=''>
                                                    {currentUser?.id === post?.userId ?
                                                        <li className='border-2 py-1 px-5 cursor-pointer hover:bg-slate-200' onClick={() => handleDeletePostButton(post)}>Delete</li>
                                                        :
                                                        <>
                                                            <li className='border-2 py-1 px-5 cursor-pointer hover:bg-slate-200' onClick={() => handleReportPostButton(post)}>Report</li>
                                                            <li className='border-2 py-1 px-5 cursor-pointer hover:bg-slate-200' onClick={() => handleRestrictButton(post)}>Restrict</li>
                                                            <li className='border-2 py-1 px-5 cursor-pointer hover:bg-slate-200' onClick={() => handleDeletePostButton(post)}>Delete</li>
                                                        </>
                                                    }
                                                </ul>
                                            );
                                        }
                                    })()
                                }
                            </div>

                        </div>
                        <div
                            dangerouslySetInnerHTML={{ __html: post?.postDiscription } as any}
                            className='ck-content mt-4 text-gray-700 text-sm tracking-wide pb-3'>
                        </div>

                        <div className='w-full border'>
                            {post?.postImageSrc && <img className='m-auto' src={post?.postImageSrc} alt='Post visual content' />}
                            <div className='flex w-full text-center '>
                                <button className={`w-6/12 border p-2 ${post?.like?.includes(currentUser?.id) ? 'text-sky-500' : 'text-black'}`} onClick={(e) => handlePostLikeButton(post)}><FontAwesomeIcon icon={faThumbsUp} /> Like <span>{post?.like?.length ? post?.like?.length : null}</span></button>
                                <button className='w-6/12 border p-2 ' onClick={() => setActivePostForComments((prev) => (prev === post?.id ? null : post?.id))}><FontAwesomeIcon icon={faCommentDots} /> Comment <span>{postComments?.length ? postComments?.length : null}</span></button>
                            </div>
                        </div>
                        {activePostForComments === post?.id && (
                            <>
                                <div className='flex items-center bg-white rounded-lg py-7'>
                                    <p className='h-12 w-12 border-2 rounded-full mr-3 flex items-center justify-center overflow-hidden'>{currentUser?.imageSrc ? <img src={currentUser?.imageSrc} alt='Profile' /> : currentUser?.firstName?.charAt(0)}</p>
                                    <input onChange={(e) => setCommentData(e?.target?.value)} value={commentData} className='w-4/5 text-start border-2 rounded-full hover:bg-gray-100 px-3 py-2' placeholder={`What's on your mind?`} />
                                    <button onClick={() => handleSendCommentButton(post?.id)} className='px-3 text-xl text-emerald-600'><FontAwesomeIcon icon={faPaperPlane} /></button>
                                </div>
                                {
                                    postComments?.map((comment: Comments) => {
                                        const commentUser = registrationData?.find((user: RegistrationFormInputs) => user?.id === comment?.userId) as RegistrationFormInputs;
                                        const commentReplies = commentReplyData?.filter((reply: Reply) => reply?.commnetId === comment?.id).reverse() as Reply[];
                                        return (
                                            <div key={comment?.id} className='py-2 border-b'>
                                                <div className='flex justify-between'>
                                                    <div className='flex items-center'>
                                                        <p className='h-12 w-12 border-2 rounded-full mr-3 flex items-center justify-center overflow-hidden'>{commentUser?.imageSrc ? <img src={commentUser?.imageSrc} alt='Profile' /> : commentUser?.firstName?.charAt(0)}</p>
                                                        <div>
                                                            <p className='font-semibold'>{commentUser?.firstName + ' ' + commentUser?.lastName}</p>
                                                            <span className='text-sm text-slate-400'>{commentUser?.role}</span>
                                                        </div>
                                                    </div>
                                                    <button><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                                                </div>
                                                <div>
                                                    <p className='pl-14 '>{comment?.comment}</p>
                                                    <span className='pl-14 border-r-2 px-2 text-sm text-slate-400 cursor-pointer'>Like</span><span className='px-2 text-sm text-slate-400 cursor-pointer' onClick={() => setReplyCommentId(comment?.id || null)}>Reply</span>
                                                </div>

                                                {replyCommentId === comment?.id &&
                                                    <div>
                                                        <input className='border ml-14 m-2 p-1 rounded-md' placeholder='Add reply' onChange={(e) => setReplyCommentData(e.target.value)} />
                                                        <button className='rounded-md bg-green-400 text-white p-1' onClick={() => handleSendReplyButton(comment?.id, post?.id)} >Send Reply</button>
                                                    </div>}
                                                {commentReplies?.map((reply: Reply) => {
                                                    const replyUser = registrationData?.find((user: RegistrationFormInputs) => user?.id === reply?.userId) as RegistrationFormInputs;
                                                    return (
                                                        <div key={reply?.id} className='flex justify-between ml-10 mt-2'>
                                                            <div className='flex items-center'>
                                                                <p className='h-12 w-12 border-2 rounded-full mr-3 flex items-center justify-center overflow-hidden'>
                                                                    {replyUser?.imageSrc ? <img src={replyUser?.imageSrc} alt='Profile' /> : replyUser?.firstName?.charAt(0)}
                                                                </p>
                                                                <div>
                                                                    <p className='font-semibold'>{replyUser?.firstName + ' ' + replyUser?.lastName}</p>
                                                                    <span className='text-sm text-slate-400'>{replyUser?.role}</span>
                                                                    <p className='text-gray-600'>{reply?.reply}</p>
                                                                </div>
                                                            </div>
                                                            <button><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                                                        </div>
                                                    );
                                                })}

                                            </div>
                                        )
                                    })
                                }
                            </>
                        )}
                    </div>
                )
            })}
        </>
    )
}

export default Posts;
