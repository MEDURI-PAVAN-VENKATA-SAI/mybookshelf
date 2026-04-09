export default function CommonProgress({cardStatus, type}){

    const names = { upload: {start:"uploaded", end:"published"}, report: {start:"reported", end:"resolved"} };
    const { start, end } = names[type];

    const uiStatus = {
        pending: {bg:"bg-[var(--accent)]", border:"border-[var(--accent)]", progress: 25, s:[start, "review", end], status: "Pending", mark:""},  
        in_review: {bg:"bg-[var(--accent)]", border:"border-[var(--accent)]", progress: 75, s:[start, "reviewing", end], status: "Under review", mark:""}, 
        published: {bg:"bg-[var(--success)]", border:"border-[var(--success)]", progress: 100, s:["uploaded", "reviewed", "published"], status: "Published", mark:"✓"}, 
        resolved: {bg:"bg-[var(--success)]", border:"border-[var(--success)]", progress: 100, s:["reported", "reviewed", "resolved"], status: "Resolved", mark:"✓"}, 
        rejected: {bg:"bg-red-500", border:"border-red-500", progress: 100, s:[ start, "reviewed", "rejected"], status: "Rejected", mark:"X"}, 
        removed: {bg:"bg-red-500", border:"border-red-500", progress: 100, s:[ start, "reviewed", "removed"], status: "Removed", mark:"X"}
    };

    return (
        <div className="w-full h-fit flex flex-col flex-1 text-start">
            <div className="mt-2">
                <div className="relative">
                    <div className="relative w-full h-1 bg-[var(--progressbar)] rounded-full overflow-hidden">
                        <div className={`h-full ${uiStatus[cardStatus.status].bg} transition-all`} style={{ width: `${uiStatus[cardStatus.status].progress}%` }} />
                    </div>

                    <span className={`absolute items-center w-2 h-2 z-10 -top-[calc(50%)] left-0 flex ${uiStatus[cardStatus.status].bg}
                                justify-center rounded-full border font-medium text-white ${uiStatus[cardStatus.status].border}`}>
                    </span>

                    <span className={`absolute items-center w-2 h-2 z-10 -top-[calc(50%)] left-[calc(50%-4px)] flex border justify-center
                        ${(cardStatus.status===end || cardStatus.status==="rejected" || cardStatus.status==="removed" || cardStatus.status==="in_review") 
                         ? uiStatus[cardStatus.status].bg : "bg-[var(--progressbar)]"} rounded-full font-medium text-white ${uiStatus[cardStatus.status].border}`}>
                    </span>

                    <span className={`absolute items-center w-2 h-2 z-10 p-[1px] -top-[calc(50%)] right-0 flex justify-center text-center border
                        rounded-full text-[6px] ${(cardStatus.status===end || cardStatus.status==="rejected" || cardStatus.status==="removed") ? 
                        uiStatus[cardStatus.status].bg : "bg-[var(--progressbar)]"} font-medium text-white ${uiStatus[cardStatus.status].border}`}>
                        { uiStatus[cardStatus.status].mark }
                    </span>
                </div>
                <div className="text-xs mt-2 opacity-70 flex flex-row justify-between">
                    { uiStatus[cardStatus.status].s.map(i=>( <div key={i} className="min-w-12 text-center"> {i} </div> ))}
                </div>
            </div>

            <div className="w-full mt-2 mb-1 h-8 text-sm flex flex-row items-center text-start">
                <strong className="font-semibold">Status:</strong>&nbsp;{uiStatus[cardStatus.status].status}
            </div>
        </div>
    );
}