 import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Product1 from "./components/Product1";
import Login from "./components/Login";
import Cart from "./components/Cart";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Product1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;