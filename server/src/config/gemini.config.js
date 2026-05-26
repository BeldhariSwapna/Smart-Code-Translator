import logger from "../utils/logger.js";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`;

const generateContent = async (prompt) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      logger.error(`Gemini API error (${response.status})`, { detail: err });
      throw new Error(`Gemini API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      logger.warn("Gemini returned empty response", { prompt: prompt.slice(0, 200) });
      throw new Error("Gemini returned an empty response");
    }
    return text;
  } catch (error) {
    if (error.message.startsWith("Gemini")) throw error;
    logger.error("Gemini fetch error", { error: error.message });
    throw new Error(`Gemini API error: ${error.message}`);
  }
};

export default generateContent;
