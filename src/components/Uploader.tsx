"use client";

import React from "react";

export default function Uploader({ onIndexed }: { onIndexed: () => void }) {
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files?.[0];
    const form = new FormData();
    form.append("file", file);
    try {
      await fetch("/api/index", { method: "POST", body: form });
      onIndexed();
    } catch (err: any) {
      alert(err.message || "Upload failed");
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-2xl shadow">
      <h3 className="font-medium">Quick Upload</h3>
      <input type="file" onChange={onChange} className=" cursor-pointer" />
    </div>
  );
}
