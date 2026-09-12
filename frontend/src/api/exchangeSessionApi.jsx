import api from "./axios";

export const createExchangeSession = async (
    exchangeId,
    sessionData
) => {
    const response = await api.post(
        `/exchanges/${exchangeId}/sessions`,
        sessionData
    );

    return response.data;
};


export const getExchangeSessions = async (
    exchangeId
) => {
    const response = await api.get(
        `/exchanges/${exchangeId}/sessions`
    );

    return response.data;
};


export const completeExchangeSession = async (
    exchangeId,
    sessionId
) => {
    const response = await api.put(
        `/exchanges/${exchangeId}/sessions/${sessionId}/complete`
    );

    return response.data;
};