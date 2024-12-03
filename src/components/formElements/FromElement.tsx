import React from 'react';

const FromElement = (props: any) => {
    const isPassword = props?.title === 'Password:';

    return (
        <div className="">
            <p className="">{props?.title}</p>
            <input {...props?.data} className="w-full border-2 rounded p-1" type={isPassword ? 'password' : 'text'} placeholder={props?.placeholder} />
            <p className="min-h-5 text-red-500 text-sm">{props?.error}</p>
        </div>
    )
}

export default FromElement;
