import { LogOut, Megaphone } from "lucide-react";
import { formatRole, getDepartmentLabel } from "../../utils/helpers";

const DashboardHeader = ({ currentUserRole, onLogout, selectedRoom, username }) => {
  return (
    <header className="dashboard-header">
      <div className="brand-lockup">
        <span className="brand-mark">
          <Megaphone size={18} strokeWidth={2} />
        </span>
        <strong>BrickRed Broadcast</strong>
      </div>
      <h1>Institution Broadcast Dashboard</h1>
      <div className="header-user">
        <div>
          <strong>{username}</strong>
          <span>
            {formatRole(currentUserRole)} - {getDepartmentLabel(selectedRoom)}
          </span>
        </div>
        <button className="secondary-button" onClick={onLogout}>
          <LogOut size={16} strokeWidth={2} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
