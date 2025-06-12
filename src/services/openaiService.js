require("dotenv").config(); // Load biến môi trường

import OpenAI from "openai";
import fetch, { Headers } from "node-fetch";

if (!globalThis.Headers) {
  globalThis.Headers = Headers;
}

// Hàm async để load Blob bằng dynamic import
const loadBlob = async () => {
  const { default: Blob } = await import("fetch-blob");
  if (typeof globalThis.Blob === "undefined") {
    globalThis.Blob = Blob;
  }
};

// Gọi loadBlob trước khi khởi tạo OpenAI
await loadBlob();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: fetch,
});

const askChatGPT = async (userMessage) => {
  try {
    const response = await openai.chat.completions.create({
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
