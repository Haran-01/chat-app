const LoginForm = ({ authMessage, email, onEmailChange, onSubmit, onPasswordChange, password }) => {
  return (
    <>
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

      {authMessage && <p className="auth-message">{authMessage}</p>}

      <button onClick={onSubmit}>Enter Institution Dashboard</button>
    </>
  );
};

export default LoginForm;
