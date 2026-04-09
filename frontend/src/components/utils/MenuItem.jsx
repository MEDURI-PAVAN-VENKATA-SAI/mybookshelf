export default function MenuItem({ icon, label, onClick, loading=false, danger, className = "" }) {
  return (
    <button
      onClick={onClick} disabled={loading}
      className={`w-full h-fit text-left p-2 text-sm hover:bg-[var(--border)] transition flex flex-row items-center rounded-lg bg-transparent
        ${className}`}
    >
      <div className={`${label ? "mr-3" : ""} ${danger ? "text-red-500" : "text-[var(--list-text)]"}`}> {icon} </div>
      {label && <div className={`${danger ? "text-red-500" : "text-[var(--list-text)]"}`}> {label} </div>}
    </button>
  );
}