"use client";
import SourceInput from "@/components/SourceInput";

export default function Page() {
  async function handleSubmit(form: FormData) {
    const res = await fetch("/api/index", { method: "POST", body: form });
    if (!res.ok) {
      const t = await res.text();
      alert("Indexing failed: " + t);
    } else {
      alert("Indexed successfully");
    }
  }
  return (
    <main>
      <header>
        <h1>Note LLM</h1>
      </header>
      <div>
        <div>
          <SourceInput onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  );
}
