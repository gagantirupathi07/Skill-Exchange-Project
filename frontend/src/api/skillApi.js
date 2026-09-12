import api from "./axios";

export const getAllSkills = async () => {
  const response = await api.get("/skills/get");
  return response.data;
};

export const searchSkills = async (name) => {
  const response = await api.get(
    `/skills/search?name=${encodeURIComponent(name)}`
  );

  return response.data;
};

export const getSkillById = async (skillId) => {
  const response = await api.get(`/skills/byId/${skillId}`);
  return response.data;
};