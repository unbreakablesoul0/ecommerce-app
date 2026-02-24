 import { Link } from "react-router-dom";

function Content() {
  return (
    <section className="content">
      <h2>Welcome to MyShop!</h2>
      <p>Find the best deals on top products</p>

      <Link to="/products" className="btn">
        Shop Now
      </Link>
    </section>
  );
}

export default Content;
