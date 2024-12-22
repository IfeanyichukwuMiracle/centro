import "./header.css";
import Menu from "../Menu/Menu";
import { useContext, useState } from "react";
import Signup from "../Signup/Signup";
import Login from "../Login/Login";
import Search from "../Search/Search";
import { AppContext } from "../../context/AppContextProvider";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [hide, setHide] = useState(true);
  const [showSignup, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  const { state, dispatch } = useContext(AppContext);

  const navigate = useNavigate("/");

  function logout() {
    dispatch({ type: "logout" });
    toast.success("logged out!");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }

  return (
    <>
      <Toaster />
      <Menu
        hide={hide}
        setHide={setHide}
        setShowSignUp={setShowSignUp}
        setShowLogin={setShowLogin}
      />
      {showSignup && (
        <Signup setShowSignUp={setShowSignUp} setShowLogin={setShowLogin} />
      )}
      {showLogin && (
        <Login setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
      )}
      {showSearch && <Search setShowSearch={setShowSearch} />}
      {showCart && <Cart setShowCart={setShowCart} showCart={showCart} />}
      {showWishlist && (
        <Wishlist
          setShowWishlist={setShowWishlist}
          showWishlist={showWishlist}
        />
      )}

      {/*  */}
      <section className="promo">
        <marquee>
          <span>
            Black Friday Discount 30%... <strong>Buy Now!</strong> --
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>
            Black Friday Discount 30%... <strong>Buy Now!</strong> --
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>
            Black Friday Discount 30%... <strong>Buy Now!</strong> --
          </span>
        </marquee>
      </section>
      <section className="header">
        <div className="logo-section">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 menu-icon"
            id="icon"
            style={{ paddingTop: ".2rem" }}
            onClick={() => setHide(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <Link to={`/`} style={{ color: "var(--black)" }}>
            <p className="logo">Centro</p>
          </Link>
        </div>

        <ul id="desktop-links">
          {state.token ? (
            <li
              onClick={() => {
                logout();
              }}
            >
              Logout
            </li>
          ) : (
            <li onClick={() => setShowLogin(true)}>Login</li>
          )}
          <li onClick={() => setShowSearch(true)}>Search</li>
          <li onClick={() => setShowWishlist(true)}>Wishlist</li>
          <li onClick={() => setShowCart(true)}>Cart</li>
        </ul>

        <ul id="mobile-nav-links">
          {state.token ? (
            <li
              onClick={() => {
                logout();
              }}
              id="mobile-login-btn"
              title="logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                id="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
            </li>
          ) : (
            <li
              onClick={() => setShowLogin(true)}
              id="mobile-login-btn"
              title={`login`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                id="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </li>
          )}
          <li onClick={() => setShowSearch(true)} title="search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              id="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </li>
          <li
            className="icon-number-container"
            id="mobile-wishlist-btn"
            title="wishlist"
            onClick={() => setShowWishlist(true)}
          >
            <div className="icon-number">{state.wishlist.length}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              id="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          </li>
          <li
            className="icon-number-container"
            title="cart"
            onClick={() => setShowCart(true)}
          >
            <div className="icon-number">{state.cart.length}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              id="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </li>
          {state.role === "admin" && state.token && (
            <Link to={`/dashboard/overview`}>
              <li id="dashboard">Dashboard</li>
            </Link>
          )}
        </ul>
      </section>
    </>
  );
};

export default Header;
