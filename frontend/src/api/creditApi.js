import api from "./axios";

export const getCreditBalance = async () => {
  const response = await api.get(
    "/credits/balance"
  );

  return response.data;
};

export const getCreditTransactions = async () => {
  const response = await api.get(
    "/credits/transactions"
  );

  return response.data;
};