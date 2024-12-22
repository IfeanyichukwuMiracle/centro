import { useContext } from "react";
import "./wishlist.css";
import { AppContext } from "../../context/AppContextProvider";

import image from "../../assets/image4.jpg";

const Wishlist = ({ setShowWishlist, showWishlist }) => {
  const { state } = useContext(AppContext);

  return (
    <section
      className={showWishlist ? `cart-menu show-cart` : `cart-menu hide-cart`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 close-cart-btn"
        id="icon"
        onClick={() => setShowWishlist(false)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>

      <section className="popup-content">
        <p className="cart-menu-title">Wishlist</p>
        {state.wishlist.length > 0 ? (
          state.cart.map((product) => {
            return (
              <section className="cart-menu-product" key={product._id}>
                <img src={image} alt={product.name} id="cart-menu-img" />
                <div className="cart-menu-details">
                  <p className="cart-menu-name">{product.name}</p>
                  <p className="cart-menu-price">{product.price}</p>
                  <button id="remove-btn">remove</button>
                </div>
              </section>
            );
          })
        ) : (
          <section className="empty-cart">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                style={{ color: "#838383" }}
                id="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <p style={{ color: "#838383" }}>Wishlist is empty</p>
            </div>
          </section>
        )}
      </section>

      {state.wishlist.length > 0 && (
        <button type="button" className="popup-btn">
          View Wishlist
        </button>
      )}
    </section>
  );
};

export default Wishlist;
