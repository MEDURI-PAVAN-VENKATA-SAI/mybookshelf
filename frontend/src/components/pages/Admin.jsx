import React, { useState } from "react";
import Button from "../utils/Button";
import { Upload } from "lucide-react";
import BookSkeleton from "../utils/BookSkeleton";

function Admin(){
    const [ open, setOpen ] = useState(false);
    
    return(
        <div className={`${ open ? "pointer-events-none" : "" } relative w-full h-full overflow-hidden`}>

            <div className="fixed top-0 z-10 w-full h-11 items-center flex flex-row-reverse justify-between">
                <h2 className="absolute top-0 left-0 text-xl text-white font-bold w-fit px-6 py-2 bg-[url('/wood-bg.jpg')] 
                    bg-cover bg-repeat-y rounded-r-full">My Uploads
                </h2>
                {uploads.length === 0 && 
                (<Button variant="primary" className="flex flex-row text-center my-4 cursor-pointer" onClick={()=>setOpen(true)}> 
                    <Upload size={20} className="mr-2"/> Upload New
                </Button>
                )}
                
            </div>

            <div className={`${ open ? "pointer-events-none blur-xl select-none" : "" } relative w-full h-full mx-auto p-4
                    gap-4 overflow-x-hidden overflow-y-auto scrollbar-auto flex flex-col`}>

                <div className="flex flex-wrap gap-6">
                {initialLoading &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <BookSkeleton key={i} />
                    ))}

                {!initialLoading &&
                    uploads.map(book => (
                        <BookCard key={book.bookId} book={book} />
                    ))}

                {loadingMore &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <BookSkeleton key={`more-${i}`} />
                    ))}
                </div>

                {!initialLoading && uploads.length === 0 && (
                <div className="text-center py-16 flex flex-col justify-center items-center">
                    <p className="text-lg opacity-70">No Uploads yet 📚</p>
                    <Button variant="primary" className="flex flex-row text-center my-4 cursor-pointer" onClick={()=>setOpen(true)}> 
                        <Upload size={20} className="mr-2"/> Upload
                    </Button>
                </div>
                )}
                
                {/* SENTINEL */}
                <div ref={loadMoreRef} className="h-10" />
            </div>

            <div className={`${open ? "pointer-events-auto" : "hidden"} fixed z-50 top-1 max-h-full align-middle mx-4 bg-[var(--background)] p-4 
                        justify-center shadow-md rounded-xl items-center overflow-x-hidden overflow-y-auto scrollbar-auto`}>
                {/*<UploadBook setOpen={setOpen}/>*/}
            </div>      

        </div>
    );
}

export default Admin;