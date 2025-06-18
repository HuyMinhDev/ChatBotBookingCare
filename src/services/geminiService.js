require("dotenv").config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetch, Headers, Request, Response } from "undici";

// ✅ Polyfill fetch cho Node.js < 18
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askGemini = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(userMessage);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("❌ Lỗi khi gọi Gemini:", error);
    return "Có lỗi khi gọi Google Gemini. Vui lòng thử lại sau.";
  }
};

export default { askGemini };
