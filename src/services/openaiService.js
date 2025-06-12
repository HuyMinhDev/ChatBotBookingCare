import OpenAI from "openai";
import fetch from "node-fetch"; // <- thêm dòng này

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: fetch, // <- thêm fetch vào đây
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
