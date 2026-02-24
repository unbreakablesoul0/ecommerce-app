 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Product1() {
  const [products, setProducts] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newThumb, setNewThumb] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role")?.toLowerCase());

  // load products from localStorage if available otherwise fetch remote
  useEffect(() => {
    // only fetch from remote if nothing is stored at all
    const raw = localStorage.getItem("products");
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 0) {
          // an empty array might mean admin deleted everything; leave as-is
          setProducts(parsed);
        } else {
          setProducts(parsed);
        }
      } catch (e) {
        console.warn("invalid products in storage", e);
        // corrupt value: remove and re-fetch initial set
        localStorage.removeItem("products");
        fetch("https://dummyjson.com/products?limit=50")
          .then((res) => res.json())
          .then((data) => {
            setProducts(data.products);
            localStorage.setItem("products", JSON.stringify(data.products));
          })
          .catch((err) => console.log(err));
      }
    } else {
      fetch("https://dummyjson.com/products?limit=50")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.products);
          localStorage.setItem("products", JSON.stringify(data.products));
        })
        .catch((err) => console.log(err));
    }

    // sync changes across tabs/windows
    const handleStorage = (e) => {
      if (e.key === "products") {
        setProducts(JSON.parse(e.newValue) || []);
      }
      if (e.key === "role") {
        setRole(e.newValue?.toLowerCase());
        // when role changes we could reload products as well.
        const stored2 = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(stored2);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // whenever the product list changes (admin add/delete), keep it in storage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

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
    const updated = products.filter(product => product.id !== id);
    setProducts(updated);
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
    setProducts(prev => [newProd, ...prev]);
    setNewTitle("");
    setNewPrice("");
    setNewThumb("");
    alert("Product added!");
  };

  return (
    <>
      <Header />

      {role === "admin" && (
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
      )}

      <div className="products">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.thumbnail} alt={product.title} />
            <h3>{product.title}</h3>
            <p>₹ {product.price}</p>

            {role === "admin" ? (
              <button
                style={{ background: "red", color: "white" }}
                onClick={() => handleDelete(product.id)}
              >
                Delete Product
              </button>
            ) : (
              <button
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}

export default Product1;
