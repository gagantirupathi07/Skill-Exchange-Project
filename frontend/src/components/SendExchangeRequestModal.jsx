import { useEffect, useState } from "react";

import { getAllSkills } from "../api/skillApi";
import { getMyTeachingSkills } from "../api/userSkillApi";
import { sendExchangeRequest } from "../api/exchangeRequestApi";

function SendExchangeRequestModal({
  receiver,
  onClose,
  onSuccess,
}) {
  const [allSkills, setAllSkills] = useState([]);
  const [myTeachingSkills, setMyTeachingSkills] = useState([]);

  const [requestedSkillId, setRequestedSkillId] = useState("");
  const [offeredSkillId, setOfferedSkillId] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const [skills, teachingSkills] =
        await Promise.all([
          getAllSkills(),
          getMyTeachingSkills(),
        ]);

      console.log(
        "ALL SKILLS FROM API:",
        skills
      );

      console.log(
        "MY TEACHING SKILLS FROM API:",
        teachingSkills
      );

      setAllSkills(
        Array.isArray(skills)
          ? skills
          : []
      );

      setMyTeachingSkills(
        Array.isArray(teachingSkills)
          ? teachingSkills
          : []
      );

    } catch (err) {
      console.error(
        "Error loading skills:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load skills."
      );

    } finally {
      setLoading(false);
    }
  };

  /*
   * Get the ACTUAL Skill ID.
   *
   * Important:
   * UserTeachingSkill may have its own ID.
   *
   * Example:
   *
   * {
   *   id: 10,
   *   skill: {
   *     id: 2,
   *     name: "Spring Boot"
   *   }
   * }
   *
   * We need 2, NOT 10.
   */
  const getSkillId = (skill) => {
    if (skill == null) {
      return null;
    }

    if (typeof skill === "number") {
      return skill;
    }

    if (typeof skill === "object") {

      // Highest priority:
      // nested actual Skill ID
      if (skill.skill?.id != null) {
        return Number(skill.skill.id);
      }

      // DTO format:
      // { skillId: 2, skillName: "Spring Boot" }
      if (skill.skillId != null) {
        return Number(skill.skillId);
      }

      // Simple Skill object:
      // { id: 2, name: "Spring Boot" }
      if (
        skill.id != null &&
        (
          skill.name != null ||
          skill.skillName != null
        )
      ) {
        return Number(skill.id);
      }
    }

    return null;
  };

  const getSkillName = (skill) => {
    if (skill == null) {
      return "";
    }

    if (typeof skill === "string") {
      return skill;
    }

    if (typeof skill === "object") {

      if (skill.skill?.name != null) {
        return skill.skill.name;
      }

      if (skill.skillName != null) {
        return skill.skillName;
      }

      if (skill.name != null) {
        return skill.name;
      }
    }

    return "";
  };

  /*
   * Convert receiver's teaching skill
   * into the actual Skill ID.
   */
  const getRequestedSkillId = (skill) => {
    if (!skill) {
      return null;
    }

    if (typeof skill === "number") {
      return skill;
    }

    if (typeof skill === "object") {

      if (skill.skill?.id != null) {
        return Number(skill.skill.id);
      }

      if (skill.skillId != null) {
        return Number(skill.skillId);
      }

      if (
        skill.id != null &&
        (
          skill.name != null ||
          skill.skillName != null
        )
      ) {
        return Number(skill.id);
      }
    }

    const skillName = getSkillName(skill);

    if (
      typeof skillName !== "string" ||
      skillName.trim() === ""
    ) {
      return null;
    }

    const matchingSkill = allSkills.find(
      (item) => {
        const itemName =
          getSkillName(item);

        return (
          typeof itemName === "string" &&
          itemName.trim().toLowerCase() ===
            skillName.trim().toLowerCase()
        );
      }
    );

    if (!matchingSkill) {
      return null;
    }

    return getSkillId(matchingSkill);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!requestedSkillId) {
      setError(
        "Please select a skill you want to learn."
      );
      return;
    }

    if (!receiver?.userId) {
      setError(
        "Receiver information is missing."
      );
      return;
    }

    try {
      setSending(true);

      const payload = {
        receiverId: Number(
          receiver.userId
        ),

        requestedSkillId: Number(
          requestedSkillId
        ),

        offeredSkillId: offeredSkillId
          ? Number(offeredSkillId)
          : null,
      };

      console.log(
        "================================"
      );

      console.log(
        "SENDING EXCHANGE REQUEST"
      );

      console.log(
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      console.log(
        "================================"
      );

      await sendExchangeRequest(
        payload
      );

      if (onSuccess) {
        onSuccess();
      }

      onClose();

    } catch (err) {
      console.error(
        "Error sending exchange request:",
        err
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      console.error(
        "HTTP status:",
        err.response?.status
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "An unexpected error occurred"
      );

    } finally {
      setSending(false);
    }
  };

  const receiverTeachingSkills =
    Array.isArray(
      receiver?.teachingSkills
    )
      ? receiver.teachingSkills
          .map((skill) => ({
            id: getRequestedSkillId(
              skill
            ),
            name: getSkillName(
              skill
            ),
          }))
          .filter(
            (skill) =>
              skill.id != null &&
              typeof skill.name === "string" &&
              skill.name.length > 0
          )
      : [];

  return (
    <div className="modal-overlay">

      <div className="request-modal">

        <div className="modal-header">

          <h2 className="modal-title">
            Send Exchange Request
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="modal-close"
          >
            ×
          </button>

        </div>

        <p className="modal-description">
          Requesting exchange with{" "}
          <strong>
            {receiver?.username}
          </strong>
        </p>

        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <p className="loading-text">
              Loading skills...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="modal-form"
          >

            <div className="modal-field">

              <label className="modal-label">
                Skill I Want To Learn
              </label>

              <select
                value={requestedSkillId}
                onChange={(event) =>
                  setRequestedSkillId(
                    event.target.value
                  )
                }
                disabled={sending}
                className="modal-select"
              >
                <option value="">
                  Select skill to learn
                </option>

                {receiverTeachingSkills.map(
                  (skill) => (
                    <option
                      key={skill.id}
                      value={skill.id}
                    >
                      {skill.name}
                    </option>
                  )
                )}
              </select>

              {receiverTeachingSkills.length ===
                0 && (
                <p className="modal-warning">
                  No teaching skills available
                  for this user.
                </p>
              )}

            </div>

            <div className="modal-field">

              <label className="modal-label">
                Skill I Can Teach

                <span className="modal-label-optional">
                  (Optional)
                </span>
              </label>

              <select
                value={offeredSkillId}
                onChange={(event) =>
                  setOfferedSkillId(
                    event.target.value
                  )
                }
                disabled={sending}
                className="modal-select"
              >
                <option value="">
                  No skill to offer
                </option>

                {myTeachingSkills.map(
                  (skill) => {
                    const id =
                      getSkillId(skill);

                    const name =
                      getSkillName(skill);

                    if (
                      id == null ||
                      !name
                    ) {
                      return null;
                    }

                    return (
                      <option
                        key={id}
                        value={id}
                      >
                        {name}
                      </option>
                    );
                  }
                )}
              </select>

              <p className="modal-help">
                You can request the skill
                without offering anything
                in return.
              </p>

            </div>

            <div className="modal-actions">

              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="modal-cancel"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  sending ||
                  !requestedSkillId ||
                  receiverTeachingSkills.length === 0
                }
                className="modal-submit"
              >
                {sending
                  ? "Sending..."
                  : "Send Request"}
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
}

export default SendExchangeRequestModal;