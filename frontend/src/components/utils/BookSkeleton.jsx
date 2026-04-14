export default function BookSkeleton() {
  return (
    <div className="w-40 bg-[var(--muted)] rounded-xl animate-pulse">
      <div className="h-60 bg-[var(--skeleton)] rounded-t-xl" />
      <div className="p-2 space-y-2">
        <div className="h-3 bg-[var(--skeleton)] rounded" />
        <div className="h-3 w-2/3 bg-[var(--skeleton)] rounded" />
        <div className="mt-4 flex justify-between space-y-2">
          <div className="h-3 w-5 bg-[var(--skeleton)] rounded" />
          <div className="h-3 w-2/3 bg-[var(--skeleton)] rounded" />
        </div>
      </div>
    </div>
  );
}
