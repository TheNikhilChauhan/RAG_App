"use client";

import { useState } from "react";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const ask = async (e) => {
    e.preventDefault();
    if (!question) return;
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
      setSources(data.sourceDocuments || []);
    } catch (e: any) {
      alert(e.message || "Chat failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-600 rounded-2xl shadow space-y-3">
      <h2 className="text-lg font-medium">Chat</h2>
      <form className="flex gap-2" onSubmit={ask}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 p-2 border rounded"
        />
        <button
          disabled={loading}
          className="px-4 py-2 rounded bg-green-600 text-white"
        >
          {loading ? "..." : "Ask"}
        </button>
      </form>
      {answer && (
        <div className="border-t pt-2">
          <div className="mb-2">Answer</div>
          <div className="whitespace-pre-wrap">{answer}</div>
          {sources.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              <strong>Sources</strong>
              <ul className="list-disc pl-5">
                {sources.map((s, i) => (
                  <li key={i}>
                    {s.source} - {s.snippet?.slice(0, 200)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
