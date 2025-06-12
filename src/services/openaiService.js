require("dotenv").config(); // load biến môi trường

import OpenAI from "openai";
import fetch, { Headers } from "node-fetch";
import Blob from "fetch-blob";

// Gắn Headers và Blob vào globalThis nếu chưa có
if (!globalThis.Headers) {
  globalThis.Headers = Headers;
}

if (typeof globalThis.Blob === "undefined") {
  globalThis.Blob = Blob;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: fetch, // sử dụng node-fetch
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
