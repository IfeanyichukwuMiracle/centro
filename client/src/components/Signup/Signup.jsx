import { useContext, useState } from "react";
import "./signup.css";
import axios from "axios";
import { AppContext } from "../../context/AppContextProvider";
import toast, { Toaster } from "react-hot-toast";

const Signup = ({ setShowSignUp, setShowLogin }) => {
  const { dispatch } = useContext(AppContext);
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setUser((prevUser) => {
      return { ...prevUser, [e.target.name]: e.target.value };
    });
  };

  async function handleSubmit(e) {
    const toastId = toast.loading(`Signing up.`);
    e.preventDefault();
    const { confirmPassword, ...rest } = user;
    if (confirmPassword === user.password) {
      try {
        const response = await axios.post(
          `https://centro-api.onrender.com/api/v1/user/signup`,
          { ...rest }
        );
        dispatch({
          type: "set_token",
          payload: { token: response.data.token },
        });
        dispatch({ type: "set_role_user", payload: { role: "user" } });
        toast.dismiss(toastId);
        toast.success(`Signup successful!`);
        setUser({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setShowSignUp(false);
        }, 1500);
        return;
      } catch (e) {
        toast.dismiss(toastId);
        if (e.response.data.message.includes(`E11000`)) {
          toast.error(`Email already exists. Sign in`);
          setUser({
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          return;
        }
        toast.error(`Signup error. Check connection and try again!`);
        return;
      }
    } else {
      toast.dismiss(toastId);
      toast.error(`Passwords don't match`);
      console.log("Incorrect");
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
          <p className="heading">Sign up</p>
          <p className="subheading">
            Already have an account?{" "}
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowSignUp(false);
                setShowLogin(true);
              }}
            >
              Login
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
            onClick={() => setShowSignUp(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>

          <div className="firstname-field">
            <input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="First name"
              required
              value={user.firstname}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>

          <div className="lastname-field">
            <input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Last name"
              required
              value={user.lastname}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>

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
              placeholder="Password"
              required
              value={user.password}
              onChange={(e) => {
                handleChange(e);
              }}
              minLength={8}
            />
          </div>

          <div className="confirm-password-field">
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              placeholder="Confirm Password"
              required
              value={user.confirmPassword}
              onChange={(e) => {
                handleChange(e);
              }}
              minLength={8}
            />
          </div>

          <div className="submit">
            <button type="submit">Sign up</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Signup;
