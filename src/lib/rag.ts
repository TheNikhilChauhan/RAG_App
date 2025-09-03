import { QdrantVectorStore } from "@langchain/qdrant";
import { chunkDocuments } from "./chunk";
import { getEmbeddingModel } from "./llm";
import { ensureCollection, QDRANT_COLLECTION, qdrantClient } from "./qdrant";
import type { BaseRetriever } from "@langchain/core/retrievers";
import { Document } from "@langchain/core/documents";

export async function indexDocuments(docs: Document[]) {
  //index docs and make chunks
  const chunks = await chunkDocuments(docs);

  //get embeddings and vector store
  const embeddings = getEmbeddingModel();
  const firstVector = await embeddings.embedQuery("init");

  await ensureCollection(firstVector.length);

  //indexing phase
  await QdrantVectorStore.fromDocuments(chunks, embeddings, {
    client: qdrantClient,
    collectionName: QDRANT_COLLECTION,
  });

  return chunks.length;
}

export async function getRetriver(k = 4): Promise<BaseRetriever> {
  const embeddings = getEmbeddingModel();
  const store = new QdrantVectorStore(embeddings, {
    client: qdrantClient,
    collectionName: QDRANT_COLLECTION,
  });
  return store.asRetriever(k);
}

//retrieval krega for top "k"
export async function retrieveDocs(query: string, k = 4) {
  if (!query || typeof query !== "string") {
    throw new Error("❌ retrieveDocs: query must be a non-empty string");
  }
  const retriever = await getRetriver(k);
  return await retriever.invoke(query);
}
