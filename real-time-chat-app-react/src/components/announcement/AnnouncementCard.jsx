import { useState } from "react";
import { categories, priorities } from "../../utils/constants";
import { formatTime, getDepartmentLabel } from "../../utils/helpers";

const AnnouncementCard = ({ announcement, onAnnouncementDelete, onAnnouncementEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: announcement.title,
    description: announcement.description,
    category: announcement.category,
    priority: announcement.priority,
  });

  const updateEditField = (field, value) => {
    setEditForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const saveEdit = async () => {
    await onAnnouncementEdit(announcement.id, editForm);
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditForm({
      title: announcement.title,
      description: announcement.description,
      category: announcement.category,
      priority: announcement.priority,
    });
    setIsEditing(true);
  };

  return (
    <article className={`announcement-card ${announcement.priority.toLowerCase()}`}>
      <div className="announcement-category">
        {isEditing ? (
          <select
            value={editForm.category}
            onChange={(event) => updateEditField("category", event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        ) : (
          <span className="category-badge">{announcement.category}</span>
        )}
      </div>

      <div className="announcement-main">
        {isEditing ? (
          <>
            <input
              value={editForm.title}
              onChange={(event) => updateEditField("title", event.target.value)}
            />
            <textarea
              value={editForm.description}
              onChange={(event) => updateEditField("description", event.target.value)}
            />
          </>
        ) : (
          <>
            <div className="announcement-title-row">
              <h3>{announcement.title}</h3>
              <span className={`priority-badge ${announcement.priority.toLowerCase()}`}>
                {announcement.priority}
              </span>
            </div>
            <p>{announcement.description}</p>
          </>
        )}
        <div className="announcement-meta">
          <span>
            {announcement.senderName} - {announcement.senderRole}
          </span>
          <span>
            {announcement.targetRoom === "All"
              ? "All Departments"
              : getDepartmentLabel(announcement.targetRoom)}
          </span>
        </div>
      </div>

      <div className="announcement-actions">
        <time>{formatTime(announcement.timestamp)}</time>
        <select
          value={isEditing ? editForm.priority : announcement.priority}
          onChange={(event) => updateEditField("priority", event.target.value)}
          disabled={!isEditing}
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        {isEditing ? (
          <>
            <button onClick={saveEdit}>Save</button>
            <button className="secondary-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="secondary-button" onClick={startEditing}>
              Edit
            </button>
            <button className="secondary-button" onClick={() => onAnnouncementDelete(announcement.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default AnnouncementCard;
