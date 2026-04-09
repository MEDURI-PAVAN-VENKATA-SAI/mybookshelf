export default function CommonBookSkeleton({type="reading"}) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-[var(--muted)] justify-center w-full max-w-3xl animate-pulse">

      <div className="flex gap-4">
      {/* COVER */}
        <div className="w-30 h-40 bg-[var(--skeleton)] rounded-md" />

        {/* DETAILS */}
        <div className="flex flex-col flex-1 justify-between">
          {/* TITLE */}
          <div>
            <div className="h-4 bg-[var(--skeleton)] rounded w-3/4" />
            <div className="h-3 bg-[var(--skeleton)] rounded w-1/2 mt-2" />
            <div className="h-3 bg-[var(--skeleton)] rounded w-1/4 mt-2" />
          </div>

          {/* PROGRESS */}
          <div>
            <div className="h-2 bg-[var(--skeleton)] rounded-full w-full" />
            <div className="h-3 bg-[var(--skeleton)] rounded w-1/3 mt-2" />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between flex-row-reverse items-center">
            <div className="h-8 bg-[var(--skeleton)] rounded w-28" />          
          </div>
        </div>

      </div>

      { (type === "upload") && <div className="h-3 m-2 bg-[var(--skeleton)] rounded w-full" /> }

      { (type === "report") &&
        <div className="flex flex-col gap-4">
          <div className="h-3 bg-[var(--skeleton)] rounded w-1/2" />
          <div className="h-3 bg-[var(--skeleton)] rounded w-1/2 mt-2" />
          <div className="h-3 bg-[var(--skeleton)] rounded w-3/4 mt-2" />
        </div>
      }

    </div>
  );
}
