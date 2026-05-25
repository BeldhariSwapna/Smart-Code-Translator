import generateContent from "../config/gemini.config.js";
import { getLanguageName } from "../constants/languages.js";

const MAX_HISTORY_TURNS = 10;

export const chatAboutCode = async (code, language, messages) => {
  const langName = getLanguageName(language);
  const lastMsg = messages[messages.length - 1];
  const history = messages.slice(0, -1);

  const recentHistory = history.slice(-MAX_HISTORY_TURNS);

  let prompt = `You are a senior developer mentoring a student about their ${langName} code. Be conversational, patient, and thorough. Use simple language the student can easily understand. Explain concepts, suggest improvements, and teach best practices. If the student asks in a different language (like Hindi, Tamil, etc.), ALWAYS respond in that same language.

STUDENT'S CODE (${langName}):
\`\`\`${language}
${code}
\`\`\``;

  if (recentHistory.length > 0) {
    prompt += `\n\nPREVIOUS CONVERSATION:\n${recentHistory.map((m) => `${m.role === "user" ? "Student" : "Mentor"}: ${m.content}`).join("\n")}`;
  }

  prompt += `\n\nStudent: ${lastMsg.content}\nMentor:`;

  return await generateContent(prompt);
};
