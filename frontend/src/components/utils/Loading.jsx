import React from "react";
import SafeImage from "./SafeImage";

export default function Loading({message="", className=""}) {
    return(
        <div className={`absolute w-[100%] h-[100%] flex flex-col justify-center items-center bg-transparent z-100 ${className}`}>
            <div className="w-fit h-[50%] min-w-[200px] flex flex-col justify-center items-center bg-transparent">                
                <SafeImage src="/books_loading.gif" alt="" className="w-fit h-fit max-w-40 max-h-30" />
                <div className="w-fit h-fit text-[var(--text)] text-xl content-center justify-center items-center p-4 
                    font-bold">{message}</div>
            </div>
        </div>
    );
}