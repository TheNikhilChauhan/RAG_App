import { PromptTemplate } from "@langchain/core/prompts";

export function getChatPrompt() {
  return new PromptTemplate({
    template: `You are an assistant that answers questions based on the provided context.\n\nContext:\n{context}\n\nQuestion:\n{question}\n\nAnswer:`,
    inputVariables: ["context", "question"],
  });
}
