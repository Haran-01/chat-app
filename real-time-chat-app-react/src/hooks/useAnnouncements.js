export const useAnnouncements = ({
  announcements,
  categoryFilter,
  priorityFilter,
  searchResults,
  searchText,
}) => {
  const visibleAnnouncements = searchText.trim() ? searchResults : announcements;

  const filteredAnnouncements = visibleAnnouncements.filter((item) => {
    // Frontend filtering stays beginner-friendly by using plain array filter checks.
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;

    return matchesCategory && matchesPriority;
  });

  const today = new Date().toDateString();
  const todayCount = announcements.filter(
    (item) => new Date(item.timestamp).toDateString() === today
  ).length;
  const emergencyCount = announcements.filter((item) => item.priority === "Emergency").length;

  return { emergencyCount, filteredAnnouncements, todayCount };
};
