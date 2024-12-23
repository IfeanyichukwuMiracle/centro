import { useContext, useEffect, useState } from "react";
import { Footer, Footnote, Header } from "../../components";
import "./cart.css";
import { AppContext } from "../../context/AppContextProvider";

import { Link } from "react-router-dom";

const Cart = () => {
  const { dispatch, state } = useContext(AppContext);
  const [total, setTotal] = useState(0);

  function removeProduct(id) {
    dispatch({ type: "remove_product", payload: id });
  }
  function increaseAmount(id) {
    dispatch({ type: "increase_amount", payload: id });
  }
  function decreaseAmount(id) {
    dispatch({ type: "decrease_amount", payload: id });
  }

  function getTotal() {
    let totalAmt = 0;

    state.cart.forEach((item) => {
      const amount = item.amount * item.price;
      totalAmt += amount;
    });
    setTotal(totalAmt);
  }
  useEffect(() => {
    document.title = `Centro | Cart - (${state.cart.length}) Items`;
    getTotal();
  }, [state]);
  return (
    <>
      <Header />

      {state.cart.length > 0 ? (
        <section className="cart-container">
          <p className="cart-title">{state.cart.length} items in cart</p>

          <section className="cart-items-grid">
            <p className="cart-head">Product</p>
            <p className="cart-head">Name</p>
            <p className="cart-head">Quantity</p>
            <p className="cart-head">Price</p>
            <p className="cart-head">&nbsp;</p>
          </section>

          {state.cart.map((item) => {
            return (
              <section className="cart-items-grid cart-items" key={item._id}>
                <div className="cart-item-img cart-head">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    id="cart-image"
                    style={{ display: "block" }}
                  />
                </div>
                <p className="cart-item-name">{item.name}</p>
                <div className="cart-item-quantity">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.amount > 1) {
                        decreaseAmount(item._id);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.9}
                      stroke="currentColor"
                      className="size-6"
                      id="cart-page-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14"
                      />
                    </svg>
                  </button>
                  <p>{item.amount}</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.amount < item.quantity) {
                        increaseAmount(item._id);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.9}
                      stroke="currentColor"
                      className="size-6"
                      id="cart-page-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </div>
                <p className="cart-item-price">&#8358;{item.price}</p>
                <p
                  className="cart-item-remove"
                  onClick={() => {
                    removeProduct(item._id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                    style={{ paddingTop: ".3rem" }}
                    id="cart-page-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </p>
              </section>
            );
          })}
          <section className="cart-card">
            <div>
              <p className="cart-card-title">Subtotal</p>
              <p className="cart-card-total">&#8358;{total}</p>
            </div>
            <div>
              <p className="cart-card-title">Total</p>
              <p className="cart-card-total">&#8358;{total}</p>
            </div>
            <Link to={`/checkout`}>
              <button>Checkout</button>
            </Link>
          </section>
        </section>
      ) : (
        <section className="empty-cart-section">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={0.9}
              stroke="currentColor"
              className="size-6"
              style={{ width: "5rem", color: "var(--black)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
            <p>Cart is empty</p>
            <Link
              to={`/`}
              style={{
                color: "blue",
                textDecoration: "underline",
                fontSize: ".94rem",
              }}
            >
              Continue shopping.
            </Link>
          </div>
        </section>
      )}

      <Footnote />
      <Footer />
    </>
  );
};

export default Cart;
