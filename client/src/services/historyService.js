import API from "./api.js";

const getHistory = async (page = 1, limit = 8, filters = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (filters.type) params.set("type", filters.type);
  if (filters.language) params.set("language", filters.language);
  if (filters.favorite !== undefined) params.set("favorite", filters.favorite);
  const response = await API.get(`/history?${params}`);
  return response.data.data;
};

const getHistoryItem = async (id) => {
  const response = await API.get(`/history/${id}`);
  return response.data.data;
};

const deleteHistoryItem = async (id) => {
  const response = await API.delete(`/history/${id}`);
  return response.data;
};

const clearHistory = async () => {
  const response = await API.delete("/history/clear");
  return response.data;
};

const toggleFavorite = async (id) => {
  const response = await API.patch(`/history/${id}/favorite`);
  return response.data.data;
};

export { getHistory, getHistoryItem, deleteHistoryItem, clearHistory, toggleFavorite };
