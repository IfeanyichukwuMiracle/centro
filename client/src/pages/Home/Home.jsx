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
      `http://localhost:9000/api/v1/product/featured-products`,
      setFeaturedProducts
    );
    getProducts(
      `http://localhost:9000/api/v1/product/latest-arrivals`,
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
        ) : (
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
        )}
      </section>

      {/*  */}

      <section className="latest-arrivals-container">
        <p className="title">Latest Arrivals</p>
        {isGetting ? (
          <Loader isLoading={isGetting} />
        ) : (
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
        )}
      </section>

      <Footnote />
      {/*  */}

      <Footer />
    </>
  );
};

export default Home;
