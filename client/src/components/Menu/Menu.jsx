import { useContext } from "react";
import "./menu.css";
import { AppContext } from "../../context/AppContextProvider";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Menu = ({ hide, setHide, setShowLogin, setShowSignUp }) => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  function logout() {
    dispatch({ type: "logout" });
    toast.success("logged out!");
    setHide(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }
  return (
    <>
      <Toaster />

      <section className={hide ? `menu hide` : `menu show`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 close-btn"
          id="icon"
          onClick={() => setHide(true)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
        <ul>
          <Link to={`/`} style={{ color: "var(--black)" }}>
            <li>Home</li>
          </Link>
          <Link to={`/`} style={{ color: "var(--black)" }}>
            <li>Wishlist</li>
          </Link>
          <Link to={`/cart`} style={{ color: "var(--black)" }}>
            <li>Cart</li>
          </Link>
          <Link to={`/`} style={{ color: "var(--black)" }}>
            <li>About</li>
          </Link>
          {state.role === "admin" && state.token && (
            <Link to={`/dashboard/overview`} style={{ color: "var(--black)" }}>
              <li>Dashboard</li>
            </Link>
          )}
        </ul>
        <div className="auth-btns">
          {state.token ? (
            <button
              id="logout-btn"
              onClick={() => {
                logout();
              }}
            >
              Log out
            </button>
          ) : (
            <>
              <button
                type="button"
                id="login-btn"
                onClick={() => {
                  setHide(true);
                  setShowLogin(true);
                }}
              >
                Log in
              </button>
              <button
                type="button"
                id="register-btn"
                onClick={() => {
                  setHide(true);
                  setShowSignUp(true);
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Menu;
