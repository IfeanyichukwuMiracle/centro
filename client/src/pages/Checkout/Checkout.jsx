import { useContext, useEffect, useState } from "react";
import "./checkout.css";
import { AppContext } from "../../context/AppContextProvider";
import { Footnote, Header } from "../../components";
import { Link, useNavigate } from "react-router-dom";

import { states } from "../../data";

import toast, { Toaster } from "react-hot-toast";

import axios from "axios";
import Login from "../../components/Login/Login";
import Signup from "../../components/Signup/Signup";

const Checkout = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    firstname: "",
    lastname: "",
    company_name: "",
    country: "",
    street_address1: "",
    street_address2: "",
    town: "",
    state: "",
    phone: "",
    email: "",
  });

  async function placeOrder() {
    const entries = Object.values(billingDetails);
    if (entries.includes("")) {
      toast.error(`Fields can't be empty!`);
      return;
    }
    const toastId = toast.loading(`Processing transaction!`);
    localStorage.setItem("billing_details", JSON.stringify(billingDetails));
    try {
      const response = await axios.post(
        `http://localhost:9000/api/v1/pay/transaction-initialize`,
        { email: billingDetails.email, amount: total }
      );
      toast.dismiss(toastId);
      setBillingDetails({
        firstname: "",
        lastname: "",
        company_name: "",
        country: "",
        street_address1: "",
        street_address2: "",
        town: "",
        state: "",
        phone: "",
        email: "",
      });
      window.location.href = response.data.data.data.authorization_url;
    } catch (e) {
      // console.log(e.response.data);
      toast.dismiss(toastId);
      toast.error(e.response.data.message);
      return;
    }
  }

  async function getUser() {
    if (!state.token) {
      return;
    }
    try {
      const res = await axios.get(`http://localhost:9000/api/v1/user`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      const { firstname, lastname, email } = res.data.data;
      setBillingDetails((prevData) => {
        return { ...prevData, firstname, lastname, email };
      });
      return;
    } catch (e) {
      console.log(e.response.data);
      return;
    }
  }

  function getTrxrefVerifyTrx() {
    const trxRef = window.location.href
      ?.split("?")[1]
      ?.split("&")[1]
      ?.split("=")[1];
    if (trxRef) {
      verifyTrx(trxRef);
      return;
    }
  }

  async function verifyTrx(ref) {
    try {
      const response = await axios.post(
        `http://localhost:9000/api/v1/pay/${ref}`,
        {
          products: state.cart,
          ...JSON.parse(localStorage.getItem("billing_details")),
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("billing_details");
      dispatch({ type: "clear_cart" });
    } catch (e) {
      // console.log(e.response.data);
      toast.error(`Transaction failed. Check connection and try again!`);
      return;
    }
  }

  function onCheckoutInputChange(e) {
    setBillingDetails((prevData) => ({
      ...prevData,
      [e.target.name.split("-")[1]]: e.target.value,
    }));
  }

  function onNormalInputChange(e) {
    setBillingDetails((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

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
    if (state.cart.length === 0) {
      navigate("/cart");
      return;
    }
    getTotal();
    getTrxrefVerifyTrx();
    getUser();
  }, [state]);

  return (
    <>
      <Header />
      <Toaster />
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          showLogin={showLogin}
          setShowSignUp={setShowSignUp}
          showSignUp={showSignUp}
        />
      )}
      {showSignUp && (
        <Signup
          setShowLogin={setShowLogin}
          showLogin={showLogin}
          setShowSignUp={setShowSignUp}
          showSignUp={showSignUp}
        />
      )}

      <section className="checkout-container">
        <div className="checkout-title-section">
          <p className="checkout-title">Checkout</p>
          <div className="checkout-links">
            <Link style={{ color: "var(--black)" }} to={`/`}>
              Home /{" "}
            </Link>
            <Link style={{ color: "var(--black)" }} to={`/checkout`}>
              Checkout
            </Link>
          </div>
          <div className="checkout-auth">
            Returning customer?{" "}
            <span
              onClick={() => setShowLogin(true)}
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Login
            </span>
          </div>
        </div>

        <section className="checkout-section">
          <p>Billing details</p>
          <section className="checkout-section-container">
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div>
                <label htmlFor="checkout-firstname">First name *</label>
                <br />
                <input
                  type="text"
                  name="checkout-firstname"
                  id="checkout-firstname"
                  value={billingDetails.firstname}
                  onChange={(e) => {
                    onCheckoutInputChange(e);
                  }}
                />
              </div>
              <div>
                <label htmlFor="checkout-lastname">Last name *</label>
                <br />
                <input
                  type="text"
                  name="checkout-lastname"
                  id="checkout-lastname"
                  value={billingDetails.lastname}
                  onChange={(e) => {
                    onCheckoutInputChange(e);
                  }}
                />
              </div>
              <div>
                <label htmlFor="company_name">Company name *</label>
                <br />
                <input
                  type="text"
                  name="company_name"
                  id="company_name"
                  value={billingDetails.company_name}
                  onChange={(e) => {
                    onNormalInputChange(e);
                  }}
                />
              </div>
              <div>
                <label htmlFor="country">Country / Region *</label>
                <br />
                <select
                  name="country"
                  id="country"
                  onChange={(e) => {
                    setBillingDetails((prevData) => {
                      return {
                        ...prevData,
                        country: e.target.value,
                      };
                    });
                  }}
                >
                  <option value={``}>--Select Country--</option>
                  <option value={`Nigeria`}>Nigeria</option>
                </select>
              </div>
              <div>
                <label htmlFor="street_address1">Street address *</label>
                <br />
                <input
                  type="text"
                  name="street_address1"
                  id="street_address1"
                  placeholder="House number and street name"
                  value={billingDetails.street_address1}
                  onChange={(e) => {
                    onNormalInputChange(e);
                  }}
                />
                <br />
                <input
                  type="text"
                  name="street_address2"
                  id="street_address2"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={billingDetails.street_address2}
                  onChange={(e) => {
                    onNormalInputChange(e);
                  }}
                />
              </div>
              <div>
                <label htmlFor="town">Town / City *</label>
                <br />
                <input
                  type="text"
                  name="town"
                  id="town"
                  value={billingDetails.town}
                  onChange={(e) => {
                    onNormalInputChange(e);
                  }}
                />
              </div>
              <div>
                <label htmlFor="state">State *</label>
                <br />
                <select
                  name="state"
                  id="state"
                  onChange={(e) => {
                    onNormalInputChange(e);
                  }}
                >
                  <option value={``}>--Select State--</option>
                  {states.map((item) => {
                    return (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="phone">Phone *</label>
                <br />
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  value={billingDetails.phone}
                  onChange={(e) => {
                    onNormalInputChange(e);
                  }}
                />
              </div>
              <div>
                <label htmlFor="checkout-email">Email address *</label>
                <br />
                <input
                  type="email"
                  name="checkout-email"
                  id="checkout-email"
                  value={billingDetails.email}
                  onChange={(e) => {
                    onCheckoutInputChange(e);
                  }}
                />
              </div>
            </form>
            <section className="order-summary">
              <p className="order-summary-title">Order Summary</p>
              <section className="order-products">
                {state.cart.map((product) => {
                  return (
                    <div className="order-product" key={product._id}>
                      <div className="order-product-details-container">
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          id="checkout-img"
                          style={{
                            display: "block",
                            width: "25%",
                            minWidth: "4.2rem",
                            borderRadius: ".2rem",
                          }}
                        />
                        <div className="order-product-details">
                          <p className="order-name">{product.name}</p>
                          <p className="order-price">&#8358;{product.price}</p>
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
                        </div>
                      </div>
                      <p
                        className="remove-btn"
                        onClick={() => {
                          removeProduct(product._id);
                        }}
                      >
                        remove
                      </p>
                    </div>
                  );
                })}
              </section>
              <section className="subtotal">
                <p className="subtotal-title">Subtotal</p>
                <p className="subtotal-price">&#8358;{total}</p>
              </section>
              <section className="total">
                <p className="total-title">Total</p>
                <p className="total-price">&#8358;{total}</p>
              </section>
              <button type="button" id="order-btn" onClick={placeOrder}>
                Place order
              </button>
            </section>
          </section>
        </section>
      </section>

      <Footnote />
    </>
  );
};

export default Checkout;
