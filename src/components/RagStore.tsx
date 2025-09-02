"use client";

import { useEffect, useState } from "react";

export default function RagStore() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/store");
    const data = await res.json();
    setItems(data.points || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function clearStore() {
    if (!confirm("Clear the collection?")) return;
    await fetch("/api/store", { method: "DELETE" });
    load();
  }

  return (
    <div className="p-4 bg-gray-800 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">RAG Store</h3>
        <button
          className="px-3 py-1 bg-red-600 text-white rounded"
          onClick={clearStore}
        >
          Clear
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No Items</p>
      ) : (
        <div className="space-y-2 max-h-[420px] overflow-auto">
          {items.map((item: any) => (
            <div key={item.id} className="p-2 border rounded">
              <div className="text-xs text-gray-500">
                {JSON.stringify(item.payload?.source || item.payload || {})}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
