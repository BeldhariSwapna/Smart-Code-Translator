export const parseGeminiJSON = (text) => {
  try {
    let cleanText = text.trim();
    // strip markdown code fences
    cleanText = cleanText.replace(/^```(?:json)?\s*\n?/, "");
    cleanText = cleanText.replace(/\n?```\s*$/, "");
    // find first { and last }
    const start = cleanText.indexOf("{");
    const end = cleanText.lastIndexOf("}");
    if (start !== -1 && end > start) {
      cleanText = cleanText.slice(start, end + 1);
    }
    return JSON.parse(cleanText.trim());
  } catch (error) {
    throw new Error(`Failed to parse Gemini response as JSON. Raw: ${text.slice(0, 200)}`);
  }
};

export const cleanCodeResponse = (text) => {
  let cleanText = text.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```\w*\s*\n?/, "");
    cleanText = cleanText.replace(/\n?```\s*$/, "");
  }
  return cleanText.trim();
};
