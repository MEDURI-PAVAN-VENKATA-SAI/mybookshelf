import React, { useState } from "react";
import { useReadingTracker } from "../hooks/useReadingTracker";

function Reader(){
    const book={};
    const [currentPage, setCurrentPage] = useState(book.readingStatus.currentPage || 0);
    const { saveProgress } = useReadingTracker({ bookId: book.bookId, currentPage });

    const handlePageChange = (page) => { setCurrentPage(page); };

    return(
        <></>
    );
}

export default Reader;