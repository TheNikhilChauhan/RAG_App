import { loadFileFromBuffer, loadText, loadUrl } from "@/lib/loaders";
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

    if (content.includes("multipart/form-data")) {
      const form = await req.formData();
      const text = form.get("text") as string | null;
      const url = form.get("url") as string | null;
      const website = form.get("website") as string | null;
      const file = form.get("file") as any;

      let docs: any[] = [];
      if (text) docs = await loadText(text, "textarea");
      else if (url) docs = await loadUrl(url);
      else if (website) docs = await loadUrl(website);
      else if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        docs = await loadFileFromBuffer(file.name || "upload", buffer);
      } else {
        return NextResponse.json(
          {
            error: "No input provided in form",
          },
          {
            status: 400,
          }
        );
      }

      const count = await indexDocuments(docs);
      return NextResponse.json({ ok: true, count });
    }

    return NextResponse.json(
      {
        error: "Unsupported content-type",
      },
      {
        status: 400,
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || String(e) },
      { status: 500 }
    );
  }
}
