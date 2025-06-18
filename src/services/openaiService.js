require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const askChatGPT = async (userMessage) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "❌ Lỗi khi gọi OpenAI:",
      error?.response?.data || error.message
    );

    if (
      error?.response?.data?.error?.code === "insufficient_quota" ||
      error?.response?.data?.error?.message?.includes("quota")
    ) {
      return "⚠️ Tài khoản ChatGPT đã hết hạn mức sử dụng. Vui lòng liên hệ admin.";
    }

    return "Đã có lỗi xảy ra khi xử lý yêu cầu với ChatGPT.";
  }
};

module.exports = { askChatGPT };
