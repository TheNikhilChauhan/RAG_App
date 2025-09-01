import { getChatModel } from "@/lib/llm";
import { getChatPrompt } from "@/lib/prompt";
import { retrieveDocs } from "@/lib/rag";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();
  const docs = await retrieveDocs(query);

  const context = docs.map((d) => d.pageContent).join("\n\n");
  const prompt = await getChatPrompt().format({
    context,
    question: query,
  });

  const model = getChatModel();

  //streaming
  const stream = await model.stream(prompt);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async pull(controller) {
      for await (const chunk of stream) {
        let text = "";
        if (typeof chunk.content === "string") {
          text = chunk.content;
        } else if (Array.isArray(chunk.content)) {
          text = chunk.content.map((c: any) => c.text ?? "").join("");
        }
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
