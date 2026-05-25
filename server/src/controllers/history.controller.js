import * as historyService from "../services/history.service.js";

export const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.language) filters.language = req.query.language;
    if (req.query.favorite !== undefined) filters.favorite = req.query.favorite === "true";
    const result = await historyService.getUserHistory(req.user._id, page, limit, filters);
    return res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getHistoryItem = async (req, res, next) => {
  try {
    const entry = await historyService.getHistoryEntry(req.params.id, req.user._id);
    return res.json({ success: true, data: entry });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const deleteHistoryItem = async (req, res, next) => {
  try {
    await historyService.deleteHistoryEntry(req.params.id, req.user._id);
    return res.json({ success: true, data: { message: "Entry deleted" } });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await historyService.clearUserHistory(req.user._id);
    return res.json({ success: true, data: { message: "All history cleared" } });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const entry = await historyService.toggleFavorite(req.params.id, req.user._id);
    return res.json({ success: true, data: entry });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};
