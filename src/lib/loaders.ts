import fs from "fs";
import os from "os";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import path from "path";

//text on textarea
export async function loadText(
  text: string,
  source = "textarea"
): Promise<Document[]> {
  return [
    new Document({
      pageContent: text,
      metadata: { source },
    }),
  ];
}

//files from upload on browser
export async function loadFileFromBuffer(
  name: string,
  buf: Buffer
): Promise<Document[]> {
  const ext = name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const tmp = path.join(os.tmpdir(), `${Date.now()}-${name}`);
    fs.writeFileSync(tmp, buf);

    const loader = new PDFLoader(tmp);
    const docs = await loader.load();

    fs.unlinkSync(tmp);
    return docs as Document[];
  } else if (ext === "csv") {
    const tmp = `/tmp/${Date.now()}-${name}`;
    fs.writeFileSync(tmp, buf);

    const loader = new CSVLoader(tmp);
    const docs = await loader.load();
    fs.unlinkSync(tmp);
    return docs as Document[];
  } else if (ext === "txt" || ext === "md") {
    return [
      new Document({
        pageContent: buf.toString("utf-8"),
        metadata: { source: name },
      }),
    ];
  } else {
    return [
      new Document({
        pageContent: buf.toString(),
      }),
    ];
  }
}

// Website url loader

export async function loadUrl(url: string): Promise<Document[]> {
  const loader = new CheerioWebBaseLoader(url);
  return loader.load();
}
