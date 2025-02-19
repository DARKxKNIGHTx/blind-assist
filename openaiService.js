import axios from "axios";

const OPENAI_API_KEY = "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";

export const getChatGPTResponse = async (userInput) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: userInput }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting ChatGPT response:", error);
    return "Sorry, I couldn't process that.";
  }
};