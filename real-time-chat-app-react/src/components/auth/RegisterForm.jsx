import { registrationDepartments } from "../../utils/constants";

const RegisterForm = ({
  authMessage,
  email,
  onDepartmentChange,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onSubmit,
  onUsernameChange,
  password,
  role,
  selectedRoom,
  username,
}) => {
  return (
    <>
      <label>
        Sender Name
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={onUsernameChange}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
        />
      </label>

      <label>
        Role
        <select value={role} onChange={onRoleChange}>
          <option value="admin">admin</option>
          <option value="faculty">faculty</option>
          <option value="student_rep">student_rep</option>
          <option value="student">student</option>
        </select>
      </label>

      <label>
        Department Room
        <select value={selectedRoom} onChange={onDepartmentChange}>
          {registrationDepartments.map((department) => (
            <option key={department.shortForm} value={department.shortForm}>
              {department.label || `${department.name} (${department.shortForm})`}
            </option>
          ))}
        </select>
      </label>

      {authMessage && <p className="auth-message">{authMessage}</p>}

      <button onClick={onSubmit}>Register</button>
    </>
  );
};

export default RegisterForm;
