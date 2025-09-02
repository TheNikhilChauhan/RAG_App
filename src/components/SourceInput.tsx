"use client";
import { useState } from "react";

export default function SourceInput({
  onSubmit,
}: {
  onSubmit: (form: FormData) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      if (text) form.append("text", text);
      if (url) form.append("url", url);
      if (website) form.append("website", website);
      if (file) form.append("file", file);
      await onSubmit(form);
      setText("");
      setUrl("");
      setWebsite("");
      setFile(null);
    } catch (error: any) {
      alert(error.message || "Indexing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="p-4 bg-gray-800 rounded-2xl shadow space-y-3"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-medium">Add Data</h2>
      <textarea
        value={text}
        placeholder="Paste text..."
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        value={url}
        placeholder="Single page URL (https://...)"
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        value={website}
        placeholder="Website (scrape article/main) - https://..."
        onChange={(e) => setWebsite(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <div className="flex gap-2">
        <button
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
