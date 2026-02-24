 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Product1() {
  const [remoteProducts, setRemoteProducts] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [products, setProducts] = useState([]); // combined view
  const [deletedIds, setDeletedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newThumb, setNewThumb] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role")?.toLowerCase());

  // load configuration from storage and fetch remote list
  useEffect(() => {
    const rawDeleted = localStorage.getItem("deletedIds");
    if (rawDeleted) {
      try { setDeletedIds(JSON.parse(rawDeleted)); } catch {}
    }
    const rawCustom = localStorage.getItem("customProducts");
    if (rawCustom) {
      try { setCustomProducts(JSON.parse(rawCustom)); } catch {}
    }

    setLoading(true);
    fetch("https://dummyjson.com/products?limit=200")
      .then(res => res.json())
      .then(data => {
        // dummyjson uses 'products' property
        const list = data.products || [];
        setRemoteProducts(list);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("Unable to fetch product list");
      })
      .finally(() => setLoading(false));

    // sync changes across tabs/windows
    const handleStorage = (e) => {
      if (e.key === "deletedIds") {
        setDeletedIds(JSON.parse(e.newValue) || []);
      }
      if (e.key === "customProducts") {
        setCustomProducts(JSON.parse(e.newValue) || []);
      }
      if (e.key === "role") {
        setRole(e.newValue?.toLowerCase());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // whenever remote or custom data or deletions change, recompute combined view
  useEffect(() => {
    const merged = [...remoteProducts, ...customProducts];
    setProducts(merged);
  }, [remoteProducts, customProducts]);

  // keep deletedIds in storage
  useEffect(() => {
    localStorage.setItem("deletedIds", JSON.stringify(deletedIds));
  }, [deletedIds]);

  // persist custom additions
  useEffect(() => {
    localStorage.setItem("customProducts", JSON.stringify(customProducts));
  }, [customProducts]);

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
    navigate("/cart");
  };

  const handleDelete = (id) => {
    // mark as deleted but not remove from underlying list
    setDeletedIds(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      alert("Please provide title and price");
      return;
    }

    const newProd = {
      id: Date.now(),
      title: newTitle,
      price: parseFloat(newPrice),
      thumbnail: newThumb || "https://via.placeholder.com/150",
    };
    setCustomProducts(prev => [newProd, ...prev]);
    setNewTitle("");
    setNewPrice("");
    setNewThumb("");
    alert("Product added!");
  };

  return (
    <>
      <Header />

      {role === "admin" && (
        <div className="admin-card">
          <form className="admin-form" onSubmit={handleAddProduct}>
            <h3>Add New Product</h3>
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newThumb}
              onChange={e => setNewThumb(e.target.value)}
            />
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}

      <div className="products">
        {loading && <p>Loading products…</p>}
        {!loading && errorMsg && <p>{errorMsg}</p>}

        {!loading && !errorMsg && products.length === 0 && (
          <p>No products available.</p>
        )}

        {!loading && !errorMsg && products.length > 0 &&
          (role === "admin"
            ? products
                .filter(p => !deletedIds.includes(p.id))
                .map(p => (
                  <div className="card" key={p.id}>
                    <img src={p.thumbnail} alt={p.title} />
                    <h3>{p.title}</h3>
                    <p>₹ {p.price}</p>
                    <button
                      style={{ background: "red", color: "white" }}
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete Product
                    </button>
                  </div>
                ))
            : products.map(p => (
                <div className="card" key={p.id}>
                  <img src={p.thumbnail} alt={p.title} />
                  <h3>{p.title}</h3>
                  <p>₹ {p.price}</p>
                  <button onClick={() => handleAddToCart(p)}>
                    Add to Cart
                  </button>
                </div>
              )))
        }
      </div>

      <Footer />
    </>
  );
}

export default Product1;
