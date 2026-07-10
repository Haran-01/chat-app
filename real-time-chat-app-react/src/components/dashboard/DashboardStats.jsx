import { CalendarDays, FileText, Siren, Users } from "lucide-react";
import StatCard from "../common/StatCard";

const DashboardStats = ({ announcementsCount, emergencyCount, todayCount, usersCount }) => {
  return (
    <section className="stats-grid">
      <StatCard label="Total Announcements" value={announcementsCount} icon={FileText} />
      <StatCard label="Today's Announcements" value={todayCount} icon={CalendarDays} />
      <StatCard label="Emergency Announcements" value={emergencyCount} icon={Siren} />
      <StatCard label="Connected Users" value={usersCount} icon={Users} />
    </section>
  );
};

export default DashboardStats;
