import { useState, useMemo, useEffect, useRef } from "react";
import { uploadBook } from "../../api/books";
import { useCategories } from "../contexts/CategoriesContext";
import Button from "./Button";
import { toast } from "react-toastify";
import { DEFAULT_BOOK_UPLOAD_FORM } from "@/constants/defaultUser";
import { useLanguages } from "../contexts/LanguageContext";
import { useUser } from "../contexts/UserContext";


export default function UploadBook({ isUpload, setIsUpload }) {
  const { user } = useUser();
  const { categories = [] } = useCategories();
  const { allLanguages = [] } = useLanguages();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(DEFAULT_BOOK_UPLOAD_FORM);
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);

  const fileRef = useRef(null);
  const coverRef = useRef(null);


  const subcategories = useMemo(() => {
    return categories.find(c => c.id === form.category)?.subcategories || [];
  }, [categories, form.category]);


  // auto-assign subcategory if none exist
  useEffect(() => {
    if (!form.category) return;
    if (subcategories.length === 0) { setForm(prev => ({ ...prev, subcategory: "" })); } 
    else if (!form.subcategory) { setForm(prev => ({ ...prev, subcategory: "" })); }
  }, [form.category, subcategories]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  const clear = () => {
    setForm(DEFAULT_BOOK_UPLOAD_FORM);
    setFile(null);
    setCover(null);

    if (fileRef.current) fileRef.current.value = "";
    if (coverRef.current) coverRef.current.value = "";

    setIsUpload(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("cover", cover);
      fd.append("title", form.title);
      fd.append("ISBN", form.ISBN);
      fd.append("language", form.language);
      fd.append("description", form.description);
      fd.append("authors", form.authors);
      fd.append("category", form.category);
      fd.append("subcategory", form.subcategory);
      fd.append("publisher", form.publisher);
      fd.append("publishedYear", form.publishedYear);
      fd.append("totalPages", form.totalPages);
      fd.append("privacy", form.privacy);

      const {message, book} = await uploadBook(fd);

      toast.success(message);
      clear();
    } catch {
      toast.error("Upload failed! Please Retry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl h-full px-4 space-y-4">
      <h2 className="text-xl font-semibold">
        Upload {user.role === "admin" && "(Admin)"}
      </h2>

      <input
        name="title"
        placeholder="Book title"
        value={form.title}
        onChange={handleChange}
        className="input w-full rounded"
        required
        disabled={!isUpload}
      />

      <div className="flex gap-3">
        <input
          name="ISBN"
          placeholder="ISBN (Optional)"
          value={form.ISBN}
          onChange={handleChange}
          className="input w-full rounded"
          disabled={!isUpload}
        />

        <select
          name="language"
          value={form.language}
          onChange={handleChange}
          className="input text-sm border-2 border-[var(--border)] bg-[var(--background)] p-2 rounded scrollbar-hide"
          required
          disabled={!isUpload}
        >
          <option value="">Language</option>
          {allLanguages.map(lan => (
            <option key={lan.code} value={lan.code}>{lan.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <input
          name="publisher"
          placeholder="Publisher"
          value={form.publisher}
          onChange={handleChange}
          className="input w-full rounded"
          disabled={!isUpload}
        />

        <select
          name="privacy"
          value={form.privacy}
          onChange={handleChange}
          className="input text-sm border-2 border-[var(--border)] p-2 rounded bg-[var(--background)] scrollbar-hide"
          required
          disabled={!isUpload}
        >
          <option value="public">Public</option>
          <option value="private" disabled={ user.role === "admin" }>Private</option>
        </select>
      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="input w-full text-[16px] p-2 border-2 border-[var(--border)] rounded"
        disabled={!isUpload}
      />

      <input
        name="authors"
        placeholder="Authors (comma separated)"
        value={form.authors}
        onChange={handleChange}
        className="input w-full rounded"
        required
        disabled={!isUpload}
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input text-sm border-2 border-[var(--border)] p-2 rounded bg-[var(--background)] scrollbar-hide"
          required
          disabled={!isUpload}
        >
          <option value="">Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <select
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          className="input text-sm border-2 border-[var(--border)] p-2 rounded bg-[var(--background)] scrollbar-hide"
          disabled={!isUpload || !form.category || subcategories.length === 0}
          required
        >
          <option value="">
            {subcategories.length === 0 ? "No Subcategories" : "Subcategory"}
          </option>

          {subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="publishedYear"
          placeholder="Published year"
          value={form.publishedYear}
          onChange={handleChange}
          className="input rounded"
          disabled={!isUpload}
        />

        <input
          name="totalPages"
          type="number"
          min={0}
          placeholder="Total Pages"
          value={form.totalPages}
          onChange={handleChange}
          className="input rounded"
          disabled={!isUpload}
        />
      </div>

      <div htmlFor="cover" className="text-[16px] p-1 mb-1 text-[var(--muted-text)]">Content File :(pdf, epub) (max size: 100 MB)</div>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.epub"
        onChange={e => setFile(e.target.files[0])}
        className="w-full rounded text-[var(--muted-text)]"
        required
        disabled={!isUpload}
      />

      <div htmlFor="cover" className="text-[16px] p-1 mb-1 text-[var(--muted-text)]">Cover Image File: (max size: 2 MB)</div>
      <input
        ref={coverRef}
        type="file"
        accept="image/*"
        onChange={e => setCover(e.target.files[0])}
        className="w-full rounded text-[var(--muted-text)]"
        required
        disabled={!isUpload}
      />

      <div className="grid grid-cols-2 gap-3 mt-2">
        <Button variant="outline" onClick={clear} type="button"> Cancel </Button>
        <Button disabled={loading} type="submit"> {loading ? "Uploading..." : "Upload"} </Button>
      </div>
    </form>
  );
}