import { translateCode } from "../services/translation.service.js";
import { analyzeComplexity } from "../services/complexity.service.js";
import { optimizeCode } from "../services/optimization.service.js";
import { explainCode } from "../services/explanation.service.js";
import { chatAboutCode } from "../services/chat.service.js";
import { createHistoryEntry } from "../services/history.service.js";
import { SUPPORTED_LANGUAGES } from "../constants/languages.js";
import logger from "../utils/logger.js";

const validLanguageIds = new Set(SUPPORTED_LANGUAGES.map((l) => l.id));

export const translate = async (req, res, next) => {
  try {
    const { code, sourceLanguage, targetLanguage } = req.body;
    if (!code || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: "code, sourceLanguage, and targetLanguage are required.",
      });
    }
    if (!validLanguageIds.has(sourceLanguage) || !validLanguageIds.has(targetLanguage)) {
      return res.status(400).json({ success: false, message: "Invalid source or target language." });
    }
    const result = await translateCode(code, sourceLanguage, targetLanguage);
    createHistoryEntry({
      userId: req.user._id,
      type: "translate",
      inputCode: code,
      sourceLanguage,
      targetLanguage,
      output: result,
    }).catch((err) => logger.error("History save error: " + err.message));
    return res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const analyze = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "code and language are required.",
      });
    }
    if (!validLanguageIds.has(language)) {
      return res.status(400).json({ success: false, message: "Invalid language." });
    }
    const result = await analyzeComplexity(code, language);
    createHistoryEntry({
      userId: req.user._id,
      type: "analyze",
      inputCode: code,
      sourceLanguage: language,
      output: result,
    }).catch((err) => logger.error("History save error: " + err.message));
    return res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const optimize = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "code and language are required.",
      });
    }
    if (!validLanguageIds.has(language)) {
      return res.status(400).json({ success: false, message: "Invalid language." });
    }
    const result = await optimizeCode(code, language);
    createHistoryEntry({
      userId: req.user._id,
      type: "optimize",
      inputCode: code,
      sourceLanguage: language,
      output: result,
    }).catch((err) => logger.error("History save error: " + err.message));
    return res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const explain = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "code and language are required.",
      });
    }
    if (!validLanguageIds.has(language)) {
      return res.status(400).json({ success: false, message: "Invalid language." });
    }
    const result = await explainCode(code, language);
    createHistoryEntry({
      userId: req.user._id,
      type: "explain",
      inputCode: code,
      sourceLanguage: language,
      output: result,
    }).catch((err) => logger.error("History save error: " + err.message));
    return res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { code, language, messages } = req.body;
    if (!code || !language || !messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "code, language, and messages array are required.",
      });
    }
    if (!validLanguageIds.has(language)) {
      return res.status(400).json({ success: false, message: "Invalid language." });
    }
    const response = await chatAboutCode(code, language, messages);
    return res.json({ success: true, data: { message: response } });
  } catch (error) {
    next(error);
  }
};
