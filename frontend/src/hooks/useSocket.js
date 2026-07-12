import { useRef } from "react";
import { connectSocket } from "../services/socket";

export const useSocket = ({
  onAnnouncement,
  onAnnouncementDeleted,
  onAnnouncementHistory,
  onAnnouncementUpdated,
  onAuthError,
  onUsers,
}) => {
  const socketRef = useRef(null);

  const connectToDashboard = (authToken) => {
    socketRef.current = connectSocket();

    // Socket.IO still uses the same join/message events; the token only proves identity.
    socketRef.current.emit("join", { token: authToken });
    socketRef.current.on("message", onAnnouncement);
    socketRef.current.on("announcementUpdated", onAnnouncementUpdated);
    socketRef.current.on("announcementDeleted", onAnnouncementDeleted);
    socketRef.current.on("announcementHistory", onAnnouncementHistory);
    socketRef.current.on("users", onUsers);
    socketRef.current.on("authError", onAuthError);
  };

  const disconnectFromDashboard = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  return { socketRef, connectToDashboard, disconnectFromDashboard };
};
