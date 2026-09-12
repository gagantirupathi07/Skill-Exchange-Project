import { useEffect, useState } from "react";

import { getAllSkills } from "../../api/skillApi";

import {
  getMyTeachingSkills,
  getMyLearningSkills,
  addTeachingSkill,
  addLearningSkill,
  removeTeachingSkill,
  removeLearningSkill,
} from "../../api/userSkillApi";

import SkillSelector from "../../components/SkillSelector";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const [allSkills, teaching, learning] =
        await Promise.all([
          getAllSkills(),
          getMyTeachingSkills(),
          getMyLearningSkills(),
        ]);

      console.log("All skills:", allSkills);
      console.log("Teaching skills:", teaching);
      console.log("Learning skills:", learning);

      setSkills(allSkills || []);
      setTeachingSkills(teaching || []);
      setLearningSkills(learning || []);

    } catch (error) {
      console.error("Skills error:", error);
      console.error("Response:", error.response?.data);

      setError(
        error.response?.data?.message ||
        "Failed to load skills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddTeaching = async (skillId) => {
    try {
      setError("");
      setMessage("");

      await addTeachingSkill(skillId);

      setMessage("Teaching skill added successfully.");

      await loadSkills();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to add teaching skill."
      );
    }
  };

  const handleAddLearning = async (skillId) => {
    try {
      setError("");
      setMessage("");

      await addLearningSkill(skillId);

      setMessage("Learning skill added successfully.");

      await loadSkills();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to add learning skill."
      );
    }
  };

  const handleRemoveTeaching = async (skillId) => {
    try {
      setError("");
      setMessage("");

      await removeTeachingSkill(skillId);

      setMessage("Teaching skill removed successfully.");

      await loadSkills();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to remove teaching skill."
      );
    }
  };

  const handleRemoveLearning = async (skillId) => {
    try {
      setError("");
      setMessage("");

      await removeLearningSkill(skillId);

      setMessage("Learning skill removed successfully.");

      await loadSkills();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to remove learning skill."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">
          Loading skills...
        </p>
      </div>
    );
  }

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Skills
        </h1>

        <p className="text-gray-500 mt-2">
          Tell the community what you can teach and what you want
          to learn.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-5">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg mb-5">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <SkillSelector
          skills={skills}
          selectedSkills={teachingSkills}
          onAdd={handleAddTeaching}
          onRemove={handleRemoveTeaching}
          title="Skills I Can Teach"
          type="teaching"
        />

        <SkillSelector
          skills={skills}
          selectedSkills={learningSkills}
          onAdd={handleAddLearning}
          onRemove={handleRemoveLearning}
          title="Skills I Want To Learn"
          type="learning"
        />

      </div>

    </div>
  );
}

export default Skills;