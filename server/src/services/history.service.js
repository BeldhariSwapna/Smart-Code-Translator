import History from "../models/History.model.js";

export const createHistoryEntry = async (data) => {
  const entry = await History.create(data);
  return entry;
};

export const getUserHistory = async (userId, page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;
  const query = { userId };

  if (filters.type) query.type = filters.type;
  if (filters.language) {
    query.$or = [
      { sourceLanguage: filters.language },
      { targetLanguage: filters.language },
    ];
  }
  if (filters.favorite !== undefined) query.favorite = filters.favorite;

  const [entries, totalEntries] = await Promise.all([
    History.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    History.countDocuments(query),
  ]);
  return {
    entries,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalEntries / limit) || 1,
      totalEntries,
      limit,
    },
  };
};

export const getHistoryEntry = async (entryId, userId) => {
  const entry = await History.findOne({ _id: entryId, userId }).lean();
  if (!entry) {
    const error = new Error("History entry not found");
    error.statusCode = 404;
    throw error;
  }
  return entry;
};

export const deleteHistoryEntry = async (entryId, userId) => {
  const entry = await History.findOneAndDelete({ _id: entryId, userId });
  if (!entry) {
    const error = new Error("History entry not found");
    error.statusCode = 404;
    throw error;
  }
  return entry;
};

export const clearUserHistory = async (userId) => {
  await History.deleteMany({ userId });
};

export const toggleFavorite = async (entryId, userId) => {
  const entry = await History.findOne({ _id: entryId, userId });
  if (!entry) {
    const error = new Error("History entry not found");
    error.statusCode = 404;
    throw error;
  }
  entry.favorite = !entry.favorite;
  await entry.save();
  return entry;
};
