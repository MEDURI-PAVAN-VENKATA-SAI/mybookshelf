import React from "react";
import SafeImage from "../utils/SafeImage";

function NotFound({ message = "Page Not Found" }){
    return(
        <div className="w-full h-full max-w-[100dvw] max-h-[100dvh] flex flex-col justify-center items-center bg-[var(--background)]">
            <div className="w-fit h-[50%] min-w-[200px] flex flex-col justify-center items-center bg-[var(--background)]">
                <div className="w-fit h-fit text-gray-50 mb-2 text-xl sm:text-3xl content-center justify-center items-center p-4 
                    font-bold bg-[url('/rack.jpg')] bg-contain bg-repeat">{ message }&nbsp;!</div>
                <SafeImage src="/notfound.svg" alt="" className="w-fit h-fit" />
            </div>
        </div>
    );
}

export default NotFound;