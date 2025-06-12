require("dotenv").config();

import OpenAI from "openai";
import fetch, { Headers } from "node-fetch";

if (!globalThis.Headers) {
  globalThis.Headers = Headers;
}

let openaiInstance;

const initOpenAI = async () => {
  const { default: Blob } = await import("fetch-blob");
  if (!globalThis.Blob) {
    globalThis.Blob = Blob;
  }

  openaiInstance = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    fetch: fetch,
  });
};

const askChatGPT = async (userMessage) => {
  if (!openaiInstance) {
    await initOpenAI(); // chỉ khởi tạo khi cần
  }

  try {
    const response = await openaiInstance.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI error:", error);
    return "Có lỗi xảy ra khi gọi ChatGPT.";
  }
};

export default { askChatGPT };
