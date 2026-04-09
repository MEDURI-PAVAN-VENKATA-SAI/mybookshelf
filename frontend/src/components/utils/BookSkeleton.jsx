export default function BookSkeleton() {
  return (
    <div className="w-40 bg-[var(--muted)] rounded-xl animate-pulse">
      <div className="h-60 bg-[var(--hover)] rounded-t-xl" />
      <div className="p-2 space-y-2">
        <div className="h-3 bg-[var(--hover)] rounded" />
        <div className="h-3 w-2/3 bg-[var(--hover)] rounded" />
        <div className="mt-4 flex justify-between space-y-2">
          <div className="h-3 w-5 bg-[var(--hover)] rounded" />
          <div className="h-3 w-2/3 bg-[var(--hover)] rounded" />
        </div>
      </div>
    </div>
  );
}
