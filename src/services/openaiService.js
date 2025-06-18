require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const askChatGPT = async (userMessage) => {
  if (!openaiInstance) {
    await initOpenAI();
  }

  try {
    const response = await openaiInstance.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ Lỗi khi gọi OpenAI:", error);

    if (
      error?.error?.code === "insufficient_quota" ||
      error?.message?.includes("quota")
    ) {
      return "⚠️ Tài khoản AI đã hết hạn mức sử dụng. Vui lòng liên hệ quản trị viên hoặc thử lại sau.";
    }

    return "Có lỗi xảy ra khi gọi ChatGPT.";
  }
};

module.exports = { askChatGPT };
