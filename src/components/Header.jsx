 import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = () => {
    // preserve cart, products and users; just remove authentication info
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header>
      <h1>🏬 MyShop</h1>

      <nav>
        <Link to="/">Home</Link>
        {isLoggedIn && (
          <>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
          </>
        )}
        {!isLoggedIn && <Link to="/login">Login</Link>}
      </nav>

      {username && (
        <>
          Welcome, {username} ({role}) |
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "10px",
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </>
      )}
    </header>
  );
}

export default Header;
