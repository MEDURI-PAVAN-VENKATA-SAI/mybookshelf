import { useState, useMemo } from "react";
import { createReport } from "../../api/books";
import Button from "./Button";
import { toast } from "react-toastify";
import { defaultBook, defaultReport } from "@/constants/defaultUser";
import SafeImage from "./SafeImage";
import { Report_options } from "@/constants/filters";
import { useSelectedData } from "../contexts/SelectedDataContext";
import { useReports } from "../contexts/ReportsContext";


export default function ReportCard({ className='' }) {

  const {selectedBook, setSelectedBook, openPopUp, setOpenPopUp} = useSelectedData();
  const { addReport } = useReports();

  const safeBook = useMemo(() => ({ ...defaultBook(), ...(selectedBook || {}) }), [selectedBook] );

  const authors = safeBook.authors.length ? safeBook.authors.join(", ") : "Unknown author";

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(safeBook?.reportStatus?.issues || []);
  const [details, setDetails] = useState(safeBook?.reportStatus?.details || "");

  const clear = () => {
    setDetails("");
    setOptions([]);
    setSelectedBook(null);
    setOpenPopUp(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!safeBook.bookId || safeBook.bookId.toString().trim() === "") {
        toast.error("Something went wrong! Please try again.");
        return;
    }
    try {
      setLoading(true);
      const payload = { bookId: safeBook.bookId, issues: options, details };
      const { report } = await createReport(payload);
      const newReport = { ...defaultReport(), ...safeBook, reportStatus: report };
      addReport(newReport);
      toast.success("Reported.");
      clear();
    } 
    catch {
      toast.error("Reporting failed! Try again later");
    } 
    finally {
      setLoading(false);
    }
  }

  const removeOption = (code) => {
      setOptions((prev) => prev.filter((option) => option !== code));
  };
  
  const handleSelectOption = (e) => {
    const code = e.target.value;
    if (!code) return;
    if (!options.includes(code)) {
      setOptions((prev) => [...prev, code]);
    }
    e.target.value = "";
  };

  return (
    <div className={`align-middle w-full px-4 h-full bg-[var(--background)] justify-center items-center overflow-x-hidden overflow-y-auto scrollbar-auto ${className}`}>          
        <form onSubmit={handleSubmit} className="w-full max-w-xl h-full space-y-4">
            <div className="mb-2 text-xl items-center text-left">
                <strong > Report </strong>
            </div>
            <div className="grid grid-rows-1 min-[500px]:grid-cols-3 gap-3 max-h-fit">
                <div className="w-full h-full col-span-1 items-start flex flex-row gap-3 rounded">
                    <SafeImage src={safeBook.coverUrl} fallback={ safeBook.coverUrl ? safeBook.coverUrl : "/no-book.svg" }
                        className="mt-2 aspect-[9/16] max-[500px]:aspect-[3/4] max-[500px]:max-w-[30%] object-center rounded"/>
                    <div className="hidden max-[500px]:block space-y-1 mb-4">
                        <div className="text-lg font-semibold text-[var(--text)] line-clamp-3"> {safeBook.title} </div>
                        <p className="text-xs text-[var(--muted-text)] truncate justify-end"> {authors} </p>
                    </div>
                </div>
                <div className="w-full h-full col-span-1 min-[500px]:col-span-2 flex flex-col justify-between">
                    <div className="flex flex-col text-sm gap-y-2">
                        <div className="hidden min-[500px]:block space-y-1 mb-4">
                            <div className="text-lg font-semibold text-[var(--text)] line-clamp-2"> {safeBook.title} </div>
                            <p className="text-xs text-[var(--muted-text)] truncate justify-end"> {authors} </p>
                        </div>
                        <div className="flex flex-row gap-2 justify-between">
                            <div className="mt-2 font-semibold text-lg"> Issues </div>
                            <select
                                name="issues"
                                onChange={handleSelectOption}
                                className="input text-sm bg-[var(--secondary)] p-2 rounded max-w-fit scrollbar-hide"
                                required={options.length===0 ? true : false}
                                disabled={!openPopUp}
                            >
                                <option value="">{options.length === 0 ? "Select" : "Select more"}</option>
                                { Report_options.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ml-4 flex flex-wrap gap-2">
                            { options.map((option) => {
                                const op = Report_options.find((opt) => opt === option);

                                return (
                                <div key={option} className="p-2 bg-[var(--muted)] border rounded-xl flex align-middle gap-2">
                                    {op}
                                    <button type="button" className="border-0 bg-transparent cursor-pointer font-bold" onClick={() => removeOption(option)}>
                                        ✕
                                    </button>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-3">
                        <textarea
                            name="details"
                            placeholder="Details"
                            value={details}
                            onChange={(e)=>setDetails(e.target.value)}
                            maxLength={200}
                            className="input w-full text-[16px] p-2 border-2 border-[var(--border)] rounded"
                            required={options.find((opt)=>opt === "other") ? true : false }
                            disabled={!openPopUp}
                        />
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <Button variant="outline" onClick={clear} type="button"> Cancel </Button>
                            <Button disabled={loading} type="submit"> Report </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
  );
}