import { useCallback, useEffect, useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import AnnouncementComposer from "../components/dashboard/AnnouncementComposer";
import AnnouncementFeed from "../components/dashboard/AnnouncementFeed";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import MembersPanel from "../components/dashboard/MembersPanel";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useSocket } from "../hooks/useSocket";
import {
  deleteAnnouncementById,
  searchAnnouncements,
  updateAnnouncementById,
} from "../services/announcementService";
import { loginUser, registerUser } from "../services/authService";
import { emptyAnnouncement } from "../utils/constants";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("CSE");
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [token, setToken] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [announcement, setAnnouncement] = useState(emptyAnnouncement);
  const [joined, setJoined] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const handleNewAnnouncement = (data) => {
    if (data.isSystem) {
      return;
    }

    setAnnouncements((previousAnnouncements) => [data, ...previousAnnouncements]);
  };

  const handleAnnouncementHistory = (history) => {
    setAnnouncements(history);
  };

  const handleUpdatedAnnouncement = (updatedAnnouncement) => {
    setAnnouncements((previousAnnouncements) =>
      previousAnnouncements.map((item) =>
        item.id === updatedAnnouncement.id ? updatedAnnouncement : item
      )
    );
    setSearchResults((previousResults) =>
      previousResults.map((item) =>
        item.id === updatedAnnouncement.id ? updatedAnnouncement : item
      )
    );
  };

  const handleDeletedAnnouncement = (deletedAnnouncementId) => {
    setAnnouncements((previousAnnouncements) =>
      previousAnnouncements.filter((item) => item.id !== deletedAnnouncementId)
    );
    setSearchResults((previousResults) =>
      previousResults.filter((item) => item.id !== deletedAnnouncementId)
    );
  };

  const handleUserUpdate = (userList) => {
    const uniqueUsers = Array.from(
      new Map(userList.map((user) => [`${user.username}-${user.room}`, user])).values()
    );
    setUsers(uniqueUsers);
  };

  const { socketRef, connectToDashboard, disconnectFromDashboard } = useSocket({
    onAnnouncement: handleNewAnnouncement,
    onAnnouncementDeleted: handleDeletedAnnouncement,
    onAnnouncementHistory: handleAnnouncementHistory,
    onAnnouncementUpdated: handleUpdatedAnnouncement,
    onAuthError: setAuthMessage,
    onUsers: handleUserUpdate,
  });

  const enterDashboard = (loggedInUser, authToken) => {
    if (loggedInUser.name && authToken) {
      connectToDashboard(authToken);
      setUsername(loggedInUser.name);
      setSelectedRoom(loggedInUser.department);
      setCurrentUserRole(loggedInUser.role);
      setJoined(true);
    }
  };

  const submitAuth = async () => {
    setAuthMessage("");

    const authBody =
      authMode === "register"
        ? { name: username, email, password, role, department: selectedRoom }
        : { email, password };

    const { response, data } =
      authMode === "register" ? await registerUser(authBody) : await loginUser(authBody);

    if (!response.ok) {
      setAuthMessage(data.message || "Authentication failed");
      return;
    }

    if (authMode === "register") {
      setAuthMode("login");
      setAuthMessage("Registration successful. Please login.");
      return;
    }

    setToken(data.token);
    enterDashboard(data.user, data.token);
  };

  const sendAnnouncement = () => {
    if (announcement.title.trim() && announcement.description.trim()) {
      const targetRoom =
        currentUserRole === "admin" && selectedRoom === "All"
          ? announcement.targetRoom
          : selectedRoom;

      socketRef.current.emit("sendMessage", {
        ...announcement,
        targetRoom,
        senderName: username,
      });
      setAnnouncement(emptyAnnouncement);
    }
  };

  const logout = () => {
    disconnectFromDashboard();
    setUsername("");
    setCurrentUserRole("");
    setEmail("");
    setPassword("");
    setToken("");
    setJoined(false);
    setAnnouncements([]);
    setSearchResults([]);
    setUsers([]);
  };

  const updateAnnouncementField = (field, value) => {
    setAnnouncement((previousAnnouncement) => ({
      ...previousAnnouncement,
      [field]: value,
    }));
  };

  const updateAnnouncement = async (announcementId, updatedFields) => {
    const updatedAnnouncement = await updateAnnouncementById({
      announcementId,
      token,
      updatedFields,
    });
    handleUpdatedAnnouncement(updatedAnnouncement);
  };

  const deleteAnnouncement = async (announcementId) => {
    await deleteAnnouncementById({ announcementId, token });
    handleDeletedAnnouncement(announcementId);
  };

  const onChangeUsername = useCallback((event) => setUsername(event.target.value), []);

  const handleRoleChange = (event) => {
    const nextRole = event.target.value;

    setRole(nextRole);
    if (nextRole === "admin") {
      setSelectedRoom("All");
    } else if (selectedRoom === "All") {
      setSelectedRoom("CSE");
    }
  };

  const handleRegistrationDepartmentChange = (event) => {
    const nextRoom = event.target.value;

    setSelectedRoom(nextRoom);
    if (nextRoom === "All") {
      setRole("admin");
    } else if (role === "admin") {
      setRole("faculty");
    }
  };

  useEffect(() => {
    const runSearch = async () => {
      if (!joined || !searchText.trim()) {
        setSearchResults([]);
        return;
      }

      const results = await searchAnnouncements({ searchText, selectedRoom, token });
      setSearchResults(results);
    };

    runSearch();
  }, [joined, searchText, selectedRoom, token]);

  const { emergencyCount, filteredAnnouncements, todayCount } = useAnnouncements({
    announcements,
    categoryFilter,
    priorityFilter,
    searchResults,
    searchText,
  });
  const canCreateAnnouncements = currentUserRole !== "student";

  return (
    <div className={`campus-shell ${!joined ? "entry-shell" : ""}`}>
      {!joined ? (
        <section className="entry-panel">
          <div>
            <p className="eyebrow">Centralized Institution Broadcast Platform</p>
            <h1>BrickRed Broadcast</h1>
            <p className="entry-copy">
              Enter your institution dashboard to receive and publish live announcements.
            </p>
          </div>

          <div className="entry-form">
            <div className="auth-tabs">
              <button
                className={authMode === "login" ? "" : "secondary-button"}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                className={authMode === "register" ? "" : "secondary-button"}
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
            </div>

            {authMode === "login" ? (
              <LoginForm
                authMessage={authMessage}
                email={email}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={submitAuth}
                password={password}
              />
            ) : (
              <RegisterForm
                authMessage={authMessage}
                email={email}
                onDepartmentChange={handleRegistrationDepartmentChange}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onRoleChange={handleRoleChange}
                onSubmit={submitAuth}
                onUsernameChange={onChangeUsername}
                password={password}
                role={role}
                selectedRoom={selectedRoom}
                username={username}
              />
            )}
          </div>
        </section>
      ) : (
        <>
          <DashboardHeader
            currentUserRole={currentUserRole}
            onLogout={logout}
            selectedRoom={selectedRoom}
            username={username}
          />

          <DashboardStats
            announcementsCount={announcements.length}
            emergencyCount={emergencyCount}
            todayCount={todayCount}
            usersCount={users.length}
          />

          <main className={`dashboard-grid ${canCreateAnnouncements ? "" : "viewer-grid"}`}>
            {canCreateAnnouncements && (
              <AnnouncementComposer
                announcement={announcement}
                currentUserRole={currentUserRole}
                onAnnouncementChange={updateAnnouncementField}
                onPublish={sendAnnouncement}
                selectedRoom={selectedRoom}
              />
            )}

            <AnnouncementFeed
              categoryFilter={categoryFilter}
              filteredAnnouncements={filteredAnnouncements}
              onAnnouncementDelete={deleteAnnouncement}
              onAnnouncementEdit={updateAnnouncement}
              onCategoryFilterChange={setCategoryFilter}
              onPriorityFilterChange={setPriorityFilter}
              onSearchTextChange={setSearchText}
              priorityFilter={priorityFilter}
              searchText={searchText}
            />

            <MembersPanel users={users} />
          </main>
        </>
      )}
    </div>
  );
};

export default Dashboard;
