import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContextProvider";

import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ProductCard = ({ product }) => {
  const { state } = useContext(AppContext);

  async function deleteProduct(id) {
    const toastId = toast.loading("Deleting product.");
    try {
      await axios.patch(
        `http://localhost:9000/api/v1/product/delete/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      toast.dismiss(toastId);
      toast.success("Product deleted!");
      window.location.href = "/";
      return;
    } catch (e) {
      toast.dismiss(toastId);
      toast.error(e.response.data.message);
      return;
    }
  }

  return (
    <>
      <Toaster />

      <div id="product">
        <Link to={`/product/${product._id}`} style={{ color: "var(--black)" }}>
          <img
            src={product.image[0]}
            alt={product.name}
            style={{ display: "block", width: "100%" }}
            loading="lazy"
          />
          <div className="category">
            <p>{product.category}</p>
          </div>
          <div className="product-text">
            <p className="name">{product.name}</p>
            <p className="price">&#8358;{product.price}</p>
          </div>
        </Link>
        {state.token && state.role === "admin" && (
          <button
            id="delete-btn"
            style={{ display: "block" }}
            onClick={() => {
              deleteProduct(product._id);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </>
  );
};

export default ProductCard;
