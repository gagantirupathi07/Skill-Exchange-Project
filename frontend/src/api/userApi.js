import api from "./axios";

export const searchUsersByTeachingSkill = async (skill) => {
  const response = await api.get(
    `/users/search?skill=${encodeURIComponent(skill)}`
  );

  return response.data;
};

export const getPublicUserProfile = async (userId) => {
  const response = await api.get(
    `/users/${userId}/public-profile`
  );

  return response.data;
};