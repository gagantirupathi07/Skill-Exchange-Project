import api from "./axios";

export const getMyNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const getUnreadNotifications = async () => {
  const response = await api.get("/notifications/unread");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread/count");
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put(
    "/notifications/read-all"
  );

  return response.data;
};