"use client";
import Chat from "@/components/Chat";
import RagStore from "@/components/RagStore";
import SourceInput from "@/components/SourceInput";
import Uploader from "@/components/Uploader";

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
          <Uploader onIndexed={() => window.location.reload()} />
        </div>
        <RagStore />
      </div>
      <Chat />
    </main>
  );
}
