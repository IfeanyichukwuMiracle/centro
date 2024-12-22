import {
  Cart,
  Dashboard,
  Home,
  Product,
  Error,
  Checkout,
  Products,
} from "./pages";
import AppContextProvider from "./context/AppContextProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={`/product/:productId`} element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path={`/dashboard/:dashboardId`} element={<Dashboard />} />
          <Route path="/category/:categoryId" element={<Products />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}
export default App;
