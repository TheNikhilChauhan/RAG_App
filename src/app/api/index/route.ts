import { loadText } from "@/lib/loaders";
import { indexDocuments } from "@/lib/rag";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const content = req.headers.get("content-type") || "";

    if (content.includes("application/json")) {
      const body = await req.json();
      if (body.text) {
        const docs = await loadText(body.text, "textarea");
        const count = await indexDocuments(docs);
        return NextResponse.json({
          ok: true,
          count,
        });
      }
      if (body.url) {
        const docs = await loadUrl(body.url);
        const count = await indexDocuments(docs);
        return NextResponse.json({ ok: true, count });
      }
      return NextResponse.json(
        { error: "No text or url in JSON" },
        { status: 400 }
      );
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || String(e) },
      { status: 500 }
    );
  }
}
