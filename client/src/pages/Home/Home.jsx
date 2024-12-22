import {
  Cart,
  Footer,
  Footnote,
  Header,
  Hero,
  Loader,
  ProductCard,
} from "../../components";
import "./home.css";
import { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestArrivals, setLatestArrivals] = useState([]);
  const [isGetting, setIsGetting] = useState(false);

  async function getProducts(url, setFunc) {
    setIsGetting(true);
    try {
      const res = await axios.get(url);
      setFunc(res.data.data);
      setIsGetting(false);
    } catch (e) {
      console.log(e.response);
      setIsGetting(false);

      return;
    }
  }

  useEffect(() => {
    getProducts(
      `https://centro-api.onrender.com/api/v1/product/featured-products`,
      setFeaturedProducts
    );
    getProducts(
      `https://centro-api.onrender.com/api/v1/product/latest-arrivals`,
      setLatestArrivals
    );
  }, []);
  return (
    <>
      <Header />
      <Hero />

      <Cart />

      <section className="latest-arrivals-container">
        <p className="title">Featured Products</p>
        {isGetting ? (
          <Loader isLoading={isGetting} />
        ) : featuredProducts.length > 0 ? (
          <>
            <div className="latest-arrivals">
              {featuredProducts.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })}
            </div>

            <Link to={`/category/all_products`}>
              <button type="button" id="see-more-btn">
                See more
              </button>
            </Link>
          </>
        ) : (
          <>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginTop: "1rem",
              }}
            >
              No products
            </p>
            <Link
              to={`/category/all_products`}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Keep shopping.
            </Link>
          </>
        )}
      </section>

      {/*  */}

      <section className="latest-arrivals-container">
        <p className="title">Latest Arrivals</p>
        {isGetting ? (
          <Loader isLoading={isGetting} />
        ) : latestArrivals.length > 0 ? (
          <>
            <div className="latest-arrivals">
              {latestArrivals.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })}
            </div>

            <Link to={`/category/all_products`}>
              <button type="button" id="see-more-btn">
                See more
              </button>
            </Link>
          </>
        ) : (
          <>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginTop: "1rem",
              }}
            >
              No products
            </p>
            <Link
              to={`/category/all_products`}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Keep shopping.
            </Link>
          </>
        )}
      </section>

      <Footnote />
      {/*  */}

      <Footer />
    </>
  );
};

export default Home;
