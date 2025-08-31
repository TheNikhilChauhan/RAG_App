import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

export function getEmbeddingModel() {
  return new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY!,
    model: process.env.OPENAI_EMBED_MODEL,
  });
}

export function getChatModel() {
  return new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    model: process.env.OPENAI_CHAT_MODEL,
    streaming: true,
  });
}
