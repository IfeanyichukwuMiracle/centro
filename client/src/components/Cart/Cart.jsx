import { useContext } from "react";
import "./cart.css";
import { AppContext } from "../../context/AppContextProvider";
import { Link } from "react-router-dom";

const Cart = ({ setShowCart, showCart }) => {
  const { state, dispatch } = useContext(AppContext);

  function removeProduct(id) {
    dispatch({ type: "remove_product", payload: id });
  }
  function increaseAmount(id) {
    dispatch({ type: "increase_amount", payload: id });
  }
  function decreaseAmount(id) {
    dispatch({ type: "decrease_amount", payload: id });
  }

  return (
    <section
      className={showCart ? `cart-menu show-cart` : `cart-menu hide-cart`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 close-cart-btn"
        id="icon"
        onClick={() => setShowCart(false)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>

      <section className="popup-content">
        <p className="cart-menu-title">Cart Items</p>
        {state.cart.length > 0 ? (
          <div className="cart-menu-products-container">
            {state.cart.map((product) => {
              return (
                <>
                  <section className="cart-menu-product" key={product._id}>
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      id="cart-menu-img"
                    />
                    <div className="cart-menu-details">
                      <p className="cart-menu-name">{product.name}</p>
                      <p className="cart-menu-price">&#8358;{product.price}</p>
                      <div className="cart-menu-quantity">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.9}
                          stroke="currentColor"
                          className="size-6"
                          id="cart-page-icon"
                          onClick={() => {
                            if (product.amount > 1) {
                              decreaseAmount(product._id);
                            }
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12h14"
                          />
                        </svg>
                        <span>{product.amount}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.9}
                          stroke="currentColor"
                          className="size-6"
                          id="cart-page-icon"
                          onClick={() => {
                            if (product.amount < product.quantity) {
                              increaseAmount(product._id);
                            }
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </div>
                      <button
                        id="remove-btn"
                        onClick={() => {
                          removeProduct(product._id);
                        }}
                      >
                        remove
                      </button>
                    </div>
                  </section>
                </>
              );
            })}
          </div>
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
              <p style={{ color: "#838383" }}>Cart is empty</p>
            </div>
          </section>
        )}
      </section>

      {state.cart.length > 0 && (
        <div>
          <Link to={`/checkout`}>
            <button type="button" className="popup-btn">
              Checkout
            </button>
          </Link>
          <Link
            to={`/cart`}
            style={{ color: "blue", textDecoration: "underline" }}
          >
            <p
              style={{
                textAlign: "center",
                margin: ".5rem 0",
                fontSize: ".85rem",
              }}
            >
              View cart
            </p>
          </Link>
        </div>
      )}
    </section>
  );
};

export default Cart;
