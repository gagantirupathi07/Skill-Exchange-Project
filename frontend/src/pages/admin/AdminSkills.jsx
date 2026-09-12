import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminSkills = () => {
    const [skills, setSkills] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
    });

    const loadSkills = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/skills/admin/all");

            setSkills(response.data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load skills"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSkills();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const openCreateForm = () => {
        setEditingSkill(null);

        setFormData({
            name: "",
            category: "",
            description: "",
        });

        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const openEditForm = (skill) => {
        setEditingSkill(skill);

        setFormData({
            name: skill.name || "",
            category: skill.category || "",
            description: skill.description || "",
        });

        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingSkill(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            if (editingSkill) {
                await api.put(
                    `/skills/update/${editingSkill.id}`,
                    formData
                );

                setSuccess("Skill updated successfully.");
            } else {
                await api.post(
                    "/skills/create",
                    formData
                );

                setSuccess("Skill created successfully.");
            }

            setShowForm(false);
            setEditingSkill(null);

            setFormData({
                name: "",
                category: "",
                description: "",
            });

            await loadSkills();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to save skill"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (id) => {
        try {
            setError("");
            setSuccess("");

            await api.put(`/skills/deactivate/${id}`);

            setSuccess("Skill deactivated successfully.");

            await loadSkills();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to deactivate skill"
            );
        }
    };

    const handleActivate = async (id) => {
        try {
            setError("");
            setSuccess("");

            await api.put(`/skills/activate/${id}`);

            setSuccess("Skill activated successfully.");

            await loadSkills();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to activate skill"
            );
        }
    };

    const filteredSkills = skills.filter((skill) => {
        const searchText = search.toLowerCase().trim();

        if (!searchText) {
            return true;
        }

        return (
            skill.name?.toLowerCase().includes(searchText) ||
            skill.category?.toLowerCase().includes(searchText) ||
            skill.description?.toLowerCase().includes(searchText)
        );
    });

    if (loading) {
        return (
            <div className="admin-page">
                <h1>Skill Management</h1>
                <p>Loading skills...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>
                    <h1>Skill Management</h1>

                    <p>
                        Create, modify and manage platform skills.
                    </p>
                </div>

                <button
                    className="admin-primary-button"
                    onClick={openCreateForm}
                >
                    + Create Skill
                </button>

            </div>

            {error && (
                <p className="admin-error">
                    {error}
                </p>
            )}

            {success && (
                <p className="admin-success">
                    {success}
                </p>
            )}

            <div className="admin-toolbar">

                <input
                    type="text"
                    placeholder="Search skills..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    className="admin-search-input"
                />

            </div>

            {showForm && (
                <div className="admin-form-container">

                    <div className="admin-form-header">

                        <div>
                            <h2>
                                {editingSkill
                                    ? "Edit Skill"
                                    : "Create Skill"}
                            </h2>

                            <p>
                                {editingSkill
                                    ? "Update the selected skill."
                                    : "Add a new skill to the platform."}
                            </p>
                        </div>

                        <button
                            className="admin-close-button"
                            onClick={closeForm}
                            disabled={saving}
                        >
                            ×
                        </button>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="admin-form-grid">

                            <div className="admin-form-group">

                                <label>
                                    Skill Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength="2"
                                    maxLength="100"
                                    placeholder="e.g. Java"
                                />

                            </div>

                            <div className="admin-form-group">

                                <label>
                                    Category
                                </label>

                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    maxLength="100"
                                    placeholder="e.g. Programming"
                                />

                            </div>

                        </div>

                        <div className="admin-form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                maxLength="500"
                                rows="4"
                                placeholder="Describe the skill..."
                            />

                        </div>

                        <div className="admin-form-actions">

                            <button
                                type="button"
                                className="admin-secondary-button"
                                onClick={closeForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="admin-primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingSkill
                                        ? "Update Skill"
                                        : "Create Skill"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            <div className="admin-table-container">

                <table className="admin-table">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredSkills.length === 0 ? (

                            <tr>
                                <td colSpan="6">
                                    No skills found.
                                </td>
                            </tr>

                        ) : (

                            filteredSkills.map((skill) => (

                                <tr key={skill.id}>

                                    <td>
                                        {skill.id}
                                    </td>

                                    <td>
                                        {skill.name}
                                    </td>

                                    <td>
                                        {skill.category || "-"}
                                    </td>

                                    <td>
                                        {skill.description || "-"}
                                    </td>

                                    <td>
                                        {skill.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </td>

                                    <td>

                                        <div className="admin-action-group">

                                            <button
                                                onClick={() =>
                                                    openEditForm(skill)
                                                }
                                            >
                                                Edit
                                            </button>

                                            {skill.isActive ? (

                                                <button
                                                    onClick={() =>
                                                        handleDeactivate(
                                                            skill.id
                                                        )
                                                    }
                                                >
                                                    Deactivate
                                                </button>

                                            ) : (

                                                <button
                                                    onClick={() =>
                                                        handleActivate(
                                                            skill.id
                                                        )
                                                    }
                                                >
                                                    Activate
                                                </button>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default AdminSkills;