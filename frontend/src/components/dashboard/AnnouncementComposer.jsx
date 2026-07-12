import { categories, departments, priorities } from "../../utils/constants";

const AnnouncementComposer = ({
  announcement,
  currentUserRole,
  onAnnouncementChange,
  onPublish,
  selectedRoom,
}) => {
  return (
    <section className="composer-panel">
      <h2>Create Announcement</h2>

      <label>
        Title
        <input
          type="text"
          placeholder="Announcement title"
          value={announcement.title}
          onChange={(event) => onAnnouncementChange("title", event.target.value)}
        />
      </label>

      <label>
        Description
        <textarea
          placeholder="Write the announcement details"
          value={announcement.description}
          onChange={(event) => onAnnouncementChange("description", event.target.value)}
        />
      </label>

      <div className="form-row">
        <label>
          Category
          <select
            value={announcement.category}
            onChange={(event) => onAnnouncementChange("category", event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Priority
          <select
            value={announcement.priority}
            onChange={(event) => onAnnouncementChange("priority", event.target.value)}
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
      </div>

      {currentUserRole === "admin" && selectedRoom === "All" && (
        <label>
          Broadcast To
          <select
            value={announcement.targetRoom}
            onChange={(event) => onAnnouncementChange("targetRoom", event.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map((department) => (
              <option key={department.shortForm} value={department.shortForm}>
                {department.name} ({department.shortForm})
              </option>
            ))}
          </select>
        </label>
      )}

      <button onClick={onPublish}>Publish Announcement</button>
    </section>
  );
};

export default AnnouncementComposer;
