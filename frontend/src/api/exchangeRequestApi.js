import api from "./axios";

export const sendExchangeRequest = async (requestData) => {
  const response = await api.post(
    "/exchange-requests",
    requestData
  );

  return response.data;
};

export const getSentRequests = async () => {
  const response = await api.get(
    "/exchange-requests/sent"
  );

  return response.data;
};

export const getReceivedRequests = async () => {
  const response = await api.get(
    "/exchange-requests/received"
  );

  return response.data;
};

export const acceptExchangeRequest = async (requestId) => {
  const response = await api.put(
    `/exchange-requests/${requestId}/accept`
  );

  return response.data;
};

export const rejectExchangeRequest = async (requestId) => {
  const response = await api.put(
    `/exchange-requests/${requestId}/reject`
  );

  return response.data;
};

export const cancelExchangeRequest = async (requestId) => {
  const response = await api.put(
    `/exchange-requests/${requestId}/cancel`
  );

  return response.data;
};