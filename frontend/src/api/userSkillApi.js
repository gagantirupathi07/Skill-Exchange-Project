import api from "./axios";

export const getMyTeachingSkills = async () => {
  const response = await api.get(
    "/users/me/get-teaching-skills"
  );

  return response.data;
};

export const getMyLearningSkills = async () => {
  const response = await api.get(
    "/users/me/get-learning-skills"
  );

  return response.data;
};

export const addTeachingSkill = async (skillId) => {
  const response = await api.post(
    "/users/me/add-teaching-skills",
    {
      skillId,
    }
  );

  return response.data;
};

export const addLearningSkill = async (skillId) => {
  const response = await api.post(
    "/users/me/add-learning-skills",
    {
      skillId,
    }
  );

  return response.data;
};

export const removeTeachingSkill = async (skillId) => {
  const response = await api.delete(
    `/users/me/remove-teaching-skills/${skillId}`
  );

  return response.data;
};

export const removeLearningSkill = async (skillId) => {
  const response = await api.delete(
    `/users/me/remove-learning-skills/${skillId}`
  );

  return response.data;
};
