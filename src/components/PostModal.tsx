import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import { DialogFooter, DialogHeader } from './ui/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { currentUserData, dataMutation } from './CommonFunction';
import { sendPostData } from '@/api/api';
import { toast } from 'react-toastify';
import { Post, RegistrationFormInputs } from '@/@core/interfaces/Interface';
const PostModal = ({ isOpen, onClose }: any) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [editorData, setEditorData] = useState<string>(''); 

    const currentUser: RegistrationFormInputs | undefined = currentUserData();
    const postsMutation = dataMutation('posts', sendPostData);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event.target.files?.[0];
        if (file) {
            const reader: FileReader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);  
        }
    };

    const handlePostButton = () => {
        const post = {
            postDiscription : editorData,
            postImageSrc: selectedImage,
            userId: currentUser?.id,
            date: Date.now()
        }
        if(!currentUser?.restrict){
            if(selectedImage || editorData) {
                toast?.success('Post added successfully');
                setSelectedImage('');
                setEditorData('');
                postsMutation.mutate(post as any);
                onClose();
            } else {
                toast?.error('Please added image and description');
            }
        } else {
            toast?.error('You are restricted to post');
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-1/2 h-[70vh] p-6 bg-white rounded-lg drop-shadow-2xl fixed inset-0 m-auto overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className='flex justify-between'>
                        <span className='flex items-center pb-3'>
                            <p className='h-10 w-10 border-2 rounded-full mr-3 overflow-hidden flex items-center justify-center'>
                                 { currentUser?.imageSrc ? <img src={currentUser?.imageSrc} alt="user" className="w-10" /> : currentUser?.firstName?.charAt(0) } 
                            </p>
                            <span>
                                <p className='font-semibold'>{currentUser?.firstName + " " + currentUser?.lastName}</p>
                                <span className='text-sm text-slate-400'>{currentUser?.role}</span>
                            </span>
                        </span>
                        <button className='text-2xl' onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
                    </DialogTitle>
                        <span className='border rounded-lg'>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editorData}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setEditorData(data);
                                }}
                                config={{
                                    toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote']
                                }}
                            />
                        </span>
                        <span className='w-full'>
                            {selectedImage && <img src={selectedImage} alt="Selected" className="my-3 rounded-md m-auto border p-1" />}
                        </span>
                </DialogHeader>
                
                <DialogFooter className="text-end mt-4">
                    <label 
                        className='border py-2 px-4 cursor-pointer rounded-md'
                        htmlFor="fileInput">
                        Select image 
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageChange}
                    />
                    <button className='py-2 px-5 rounded-lg bg-green-500 text-white' onClick={handlePostButton}>Post</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PostModal;


