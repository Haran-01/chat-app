import { getDepartmentLabel, getInitials } from "../../utils/helpers";

const MembersPanel = ({ users }) => {
  return (
    <aside className="members-panel">
      <h2>Active Institution Members</h2>
      {users.length ? (
        users.map((user) => (
          <div className="member-row" key={user.id}>
            <div className="member-identity">
              <span className="online-dot" />
              <span className="avatar">{getInitials(user.username)}</span>
              <strong>{user.username}</strong>
            </div>
            <span>{getDepartmentLabel(user.room)}</span>
          </div>
        ))
      ) : (
        <p>No active members yet.</p>
      )}
    </aside>
  );
};

export default MembersPanel;
