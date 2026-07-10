import { Search } from "lucide-react";
import AnnouncementCard from "../announcement/AnnouncementCard";
import { categories, priorities } from "../../utils/constants";

const AnnouncementFeed = ({
  categoryFilter,
  filteredAnnouncements,
  onAnnouncementDelete,
  onAnnouncementEdit,
  onCategoryFilterChange,
  onPriorityFilterChange,
  onSearchTextChange,
  priorityFilter,
  searchText,
}) => {
  return (
    <section className="feed-panel">
      <div className="filters">
        <label className="search-field">
          <Search size={16} strokeWidth={2} />
          <input
            type="search"
            placeholder="Search announcements"
            value={searchText}
            onChange={(event) => onSearchTextChange(event.target.value)}
          />
        </label>
        <select value={categoryFilter} onChange={(event) => onCategoryFilterChange(event.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select value={priorityFilter} onChange={(event) => onPriorityFilterChange(event.target.value)}>
          <option value="All">All Priorities</option>
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div className="announcement-list">
        {filteredAnnouncements.length ? (
          filteredAnnouncements.map((item) => (
            <AnnouncementCard
              key={item.id}
              announcement={item}
              onAnnouncementDelete={onAnnouncementDelete}
              onAnnouncementEdit={onAnnouncementEdit}
            />
          ))
        ) : (
          <div className="empty-state">No announcements match the selected filters.</div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementFeed;
