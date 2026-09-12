function SkillSelector({
  skills,
  selectedSkills,
  onAdd,
  onRemove,
  title,
  type,
}) {
  const getSkillId = (skill) =>
    skill.skillId ??
    skill.skill?.id ??
    skill.id;

  const getSkillName = (skill) =>
    skill.name ??
    skill.skillName ??
    skill.skill?.name ??
    "Unknown Skill";

  return (
    <div className="skill-selector-card">

      <h2 className="skill-selector-title">
        {title}
      </h2>

      {selectedSkills.length > 0 ? (
        <div className="selected-skills">

          {selectedSkills.map((skill) => {
            const skillId = getSkillId(skill);
            const skillName = getSkillName(skill);

            return (
              <div
                key={skillId}
                className="selected-skill"
              >
                <span>
                  {skillName}
                </span>

                <button
                  type="button"
                  onClick={() => onRemove(skillId)}
                  className="remove-skill-button"
                  title={`Remove ${skillName}`}
                >
                  ×
                </button>
              </div>
            );
          })}

        </div>
      ) : (
        <p className="empty-text">
          No {type} skills added yet.
        </p>
      )}

      <div className="skill-select-wrapper">

        <label className="skill-select-label">
          Add Skill
        </label>

        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onAdd(Number(e.target.value));
              e.target.value = "";
            }
          }}
          className="skill-select"
        >
          <option value="">
            Select a skill
          </option>

          {skills
            .filter(
              (skill) =>
                !selectedSkills.some(
                  (selected) =>
                    getSkillId(selected) === skill.id
                )
            )
            .map((skill) => (
              <option
                key={skill.id}
                value={skill.id}
              >
                {skill.name}
              </option>
            ))}
        </select>

      </div>

    </div>
  );
}

export default SkillSelector;