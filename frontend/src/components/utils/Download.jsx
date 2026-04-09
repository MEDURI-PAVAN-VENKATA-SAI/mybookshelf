import { toast } from "react-toastify";
import Button from "./Button";

export const downloadWithToast = async (book) => {

  const controller = new AbortController();
  let progress = 0;

  const ToastContent = ({ progress, done }) => (
    <div className="w-full text-[var(--text)]">
      <div className="text-sm text-[var(--text)] line-clamp-1">{book.title}</div>

      {/* Progress Bar */}
      <div className="w-full mt-2">
        <div className="text-xs mb-2 opacity-70 flex flex-row-reverse justify-between">
          <div>{"Downloaded: " + progress}%</div>
        </div>

        <div className="relative">
          <div className="relative w-full h-1 bg-[var(--progressbar)] rounded-full overflow-hidden">
            <div
              className={`h-full ${progress !== 100 ? "bg-[var(--accent)]" : "bg-[var(--success)]"} transition-all`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {progress === 100 && (
            <span className="absolute z-10 -top-[calc(50%+4px)] right-0 bg-[var(--success)] font-medium flex items-center w-4 h-4 
              justify-center rounded-full border-2 border-[var(--success)] text-[10px] text-white">
              ✓
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-row-reverse justify-between mt-4 gap-2">
        {!done && ( <Button variant="outline" className="text-sm opacity-85" onClick={() => controller.abort()}> Cancel </Button> )}
        {done && (<Button className="text-sm opacity-85" onClick={() => toast.dismiss(toastId)}> Done </Button> )}
      </div>
    </div>
  );

  let done = false;

  const toastId = toast( <ToastContent progress={0} done={false} />, { autoClose: false, closeButton: false, draggable: false } );

  try {
    const res = await fetch(book.downloadUrl, { signal: controller.signal });

    /* ---------- FILE NAME + EXTENSION FIX ---------- */
    let filename = "";

    // 1. From headers (best)
    const disposition = res.headers.get("Content-Disposition");
    if (disposition && disposition.includes("filename")) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match) {
        filename = match[1].replace(/['"]/g, "").trim();
      }
    }

    // 2. From URL
    if (!filename) {
      const cleanUrl = book.downloadUrl.split("?")[0];
      filename = cleanUrl.split("/").pop() || book.title || "download";
    }

    // 3. Ensure extension
    if (!filename.includes(".")) {
      const mime = res.headers.get("Content-Type") || "";
      const ext = mime.split("/")[1] || "bin";
      filename = `${filename}.${ext}`;
    }

    const reader = res.body.getReader();
    const contentLength = +res.headers.get("Content-Length") || 0;

    let received = 0;
    let chunks = [];

    while (true) {
      const { done: streamDone, value } = await reader.read();
      if (streamDone) break;

      chunks.push(value);
      received += value.length;

      if (contentLength) {
        progress = Math.round((received / contentLength) * 100);
        toast.update(toastId, { render: <ToastContent progress={progress} done={false} /> });
      }
    }

    // create file
    const blob = new Blob(chunks);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;   // ✅ dynamic filename
    a.click();

    window.URL.revokeObjectURL(url);

    done = true;
    toast.update(toastId, { render: <ToastContent progress={100} done={true} /> });
  } 
  catch (err) {
    toast.dismiss(toastId); // silent close
  }
};