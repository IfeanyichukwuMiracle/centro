import { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";

export const AppContext = createContext();
//
!localStorage.getItem("cart") &&
  localStorage.setItem("cart", JSON.stringify([]));
!localStorage.getItem("wishlist") &&
  localStorage.setItem("wishlist", JSON.stringify([]));
!localStorage.getItem("token") && localStorage.setItem("token", "");
!localStorage.getItem("role") && localStorage.setItem("role", "user");

const reducer = (state, action) => {
  if (action.type === "clear_cart") {
    return { ...state, cart: [] };
  }
  if (action.type === "logout") {
    return { ...state, token: "", role: "user" };
  }
  if (action.type === "add_to_cart") {
    return {
      ...state,
      cart: [...state.cart, { ...action.payload, amount: 1 }],
    };
  }
  if (action.type === "set_token") {
    return { ...state, token: action.payload.token };
  }
  if (action.type === "set_role_admin") {
    return { ...state, role: action.payload.role };
  }
  if (action.type === "set_role_user") {
    return { ...state, role: action.payload.role };
  }
  if (action.type === "remove_product") {
    const newCart = state.cart.filter((item) => item._id !== action.payload);
    return { ...state, cart: newCart };
  }
  if (action.type === "increase_amount") {
    const newCart = state.cart.map((item) => {
      if (item._id === action.payload) item.amount = item.amount + 1;
      return item;
    });
    return { ...state, cart: newCart };
  }
  if (action.type === "decrease_amount") {
    const newCart = state.cart.map((item) => {
      if (item._id === action.payload) item.amount = item.amount - 1;
      return item;
    });
    return { ...state, cart: newCart };
  }

  throw new Error(`No such action!`);
};

const defaultState = {
  cart: JSON.parse(localStorage.getItem("cart")),
  role: localStorage.getItem("role"),
  token: localStorage.getItem("token"),
  wishlist: JSON.parse(localStorage.getItem("wishlist")),
};

const AppContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [isGetting, setIsGetting] = useState(false);

  const fetchProducts = async () => {
    setIsGetting(true);
    try {
      const response = await axios.get(
        `https://centro-api.onrender.com/api/v1/product`
      );
      setProducts(response.data.data);
      setIsGetting(false);
    } catch (e) {
      console.log(e.response.data);
      setIsGetting(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
    localStorage.setItem("role", state.role);
    localStorage.setItem("token", state.token);
    localStorage.setItem("wishlist", state.wishlist);
  }, [state]);

  return (
    <AppContext.Provider value={{ products, state, dispatch, isGetting }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
