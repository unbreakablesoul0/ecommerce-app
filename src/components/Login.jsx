 import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  // clear inputs when switching between login/signup
  useEffect(() => {
    setUsername("");
    setPassword("");
    setRole("user");
  }, [isSignupMode]);

  const handleLogin = () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(
      u => u.username === username && u.password === password
    );

    if (validUser) {
      // no need to choose role at login – use stored value
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", validUser.username);
      localStorage.setItem("role", validUser.role);

      alert("Login successful!");
      navigate("/products");
    } else {
      alert("Invalid username or password");
    }
  };

  const handleSignup = () => {
    if (!username || !password) {
      alert("All fields required");
      return;
    }
    if (username.trim().length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }
    if (password.trim().length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(u => u.username === username);

    if (userExists) {
      alert("Username already exists");
      return;
    }

    users.push({
      username,
      password,
      role: role.toLowerCase() // ✅ store properly
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Now login.");
    setIsSignupMode(false);
  };

  return (
    <>
      <Header />

      <div className={`auth-page ${isSignupMode ? 'signup' : 'login'}`}>
        <div className="auth-form">
          <h2>{isSignupMode ? "Create Account" : "Login Now"}</h2>

          <input
            type="text"
            placeholder="Email or Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {isSignupMode && (
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button onClick={isSignupMode ? handleSignup : handleLogin}>
            {isSignupMode ? 'Create' : 'Login'}
          </button>

          <div className="alternate">
            {isSignupMode ? (
              <p>
                Already a member? <span onClick={() => setIsSignupMode(false)}>Login</span>
              </p>
            ) : (
              <p>
                Not a member? <span onClick={() => setIsSignupMode(true)}>Signup now</span>
              </p>
            )}
          </div>
        </div>

        <div className="auth-illustration">
          {/* placeholder illustration, you can replace with real image */}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;
