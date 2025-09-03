import { QdrantClient } from "@qdrant/js-client-rest";
import { getEmbeddingModel } from "./llm";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || undefined;
export const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || "rag_chunks";

export const qdrantClient = new QdrantClient({
  url: QDRANT_URL!,
  apiKey: QDRANT_API_KEY,
});

//helper to ensure collection created with correct size
export async function ensureCollection(num: number) {
  const cols = await qdrantClient.getCollections();
  const exists = cols.collections?.some((c) => c.name === QDRANT_COLLECTION);

  if (!exists) {
    await qdrantClient.createCollection(QDRANT_COLLECTION, {
      vectors: { size: num, distance: "Cosine" },
    });
  }
}

export async function getVectorStore() {
  const embeddings = getEmbeddingModel();

  //instantiate vector store
  return new QdrantVectorStore(embeddings, {
    client: qdrantClient,
    collectionName: QDRANT_COLLECTION,
  });
}
