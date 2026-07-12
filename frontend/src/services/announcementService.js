import { API_BASE_URL, getAuthHeaders, getJsonHeaders } from "./api";

export const searchAnnouncements = async ({ searchText, selectedRoom, token }) => {
  const response = await fetch(
    `${API_BASE_URL}/announcements/search?q=${encodeURIComponent(searchText)}&room=${encodeURIComponent(
      selectedRoom
    )}`,
    {
      headers: getAuthHeaders(token),
    }
  );

  return response.json();
};

export const updateAnnouncementById = async ({ announcementId, updatedFields, token }) => {
  const response = await fetch(`${API_BASE_URL}/api/announcements/${announcementId}`, {
    method: "PUT",
    headers: getJsonHeaders(token),
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    throw new Error("Could not update announcement");
  }

  return response.json();
};

export const deleteAnnouncementById = async ({ announcementId, token }) => {
  const response = await fetch(`${API_BASE_URL}/api/announcements/${announcementId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Could not delete announcement");
  }
};
