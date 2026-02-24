 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

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

      <div className={`auth-container ${isSignupMode ? 'signup' : 'login'}`}>
        <div className="icon">🛡️</div>
        <h2>{isSignupMode ? "Create Account" : "Welcome Back"}</h2>

        <input
          type="text"
          placeholder="Username"
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
          <>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}

        {isSignupMode ? (
          <>
            <button onClick={handleSignup}>Signup</button>
            <p onClick={() => setIsSignupMode(false)}>
              Already have an account?
            </p>
          </>
        ) : (
          <>
            <button onClick={handleLogin}>Login</button>
            <p onClick={() => setIsSignupMode(true)}>
              Create account?
            </p>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Login;
