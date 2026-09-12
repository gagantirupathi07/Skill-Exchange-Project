import api from "./axios";

export const getMyExchanges = async () => {
  const response = await api.get("/exchanges/my");
  return response.data;
};

export const getTeachingExchanges = async () => {
  const response = await api.get("/exchanges/teaching");
  return response.data;
};

export const getLearningExchanges = async () => {
  const response = await api.get("/exchanges/learning");
  return response.data;
};

export const getExchangeById = async (exchangeId) => {
  const response = await api.get(`/exchanges/${exchangeId}`);
  return response.data;
};

export const completeExchange = async (exchangeId) => {
  const response = await api.put(
    `/exchanges/${exchangeId}/complete`
  );
  return response.data;
};