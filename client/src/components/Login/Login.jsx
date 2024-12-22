import axios from "axios";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContextProvider";
import toast, { Toaster } from "react-hot-toast";

const Login = ({ setShowLogin, setShowSignUp }) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const { dispatch } = useContext(AppContext);

  function handleChange(e) {
    setUser((prevUser) => {
      return { ...prevUser, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e) {
    const toastId = toast.loading(`Signing in.`);
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://centro-api.onrender.com/api/v1/user/login`,
        user
      );
      dispatch({ type: "set_token", payload: { token: response.data.token } });
      if (response.data?.role === "admin")
        dispatch({
          type: "set_role_admin",
          payload: { role: response.data?.role },
        });
      else dispatch({ type: "set_role_user", payload: { role: "user" } });
      setUser({
        email: "",
        password: "",
      });
      toast.dismiss(toastId);
      toast.success(`Sign in successful`);
      setTimeout(() => {
        setShowLogin(false);
      }, 1500);
      return;
    } catch (e) {
      toast.dismiss(toastId);
      if (e.response.data?.message) {
        toast.error(`Incorrect email or password!`);
        return;
      }
      toast.error(`Sign in error. Check connection and try again!`);
      return;
    }
  }

  return (
    <>
      <Toaster />

      <section className="signup-container">
        <form
          method="post"
          className="signup-form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <p className="heading">Sign in</p>
          <p className="subheading">
            Don&apos;t have an account?{" "}
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowLogin(false);
                setShowSignUp(true);
              }}
            >
              Sign up
            </span>
          </p>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 auth-close-btn"
            id="cancel-icon"
            onClick={() => setShowLogin(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>

          <div className="email-field">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
              value={user.email}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>

          <div className="password-field">
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="Password"
              value={user.password}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>

          <div className="submit">
            <button type="submit">Log in</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
