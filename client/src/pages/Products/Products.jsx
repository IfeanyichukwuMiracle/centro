import "./products.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { product_categories } from "../../data";
import { useEffect, useState } from "react";
import { Footer, Footnote, Header, Loader } from "../../components";
import axios from "axios";

const Products = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  async function getProducts() {
    setIsFetching(true);
    try {
      if (categoryId === "all_products") {
        const res = await axios.get(
          `https://centro-api.onrender.com/api/v1/product?limit=${10}`
        );
        setProducts(res.data.data);
        setIsFetching(false);
        return;
      }
      const res = await axios.get(
        `https://centro-api.onrender.com/api/v1/product?category=${categoryId
          .split("_")
          .join(" ")}`
      );
      setProducts(res.data.data);
      setIsFetching(false);
      return;
    } catch (e) {
      console.log(e.response.data);
      setIsFetching(false);
      setProducts([]);
      return;
    }
  }

  useEffect(() => {
    if (!product_categories.find((category) => category === categoryId)) {
      navigate("/error");
      return;
    }
    document.title = "Centro | Products";

    getProducts();
  }, [categoryId]);
  return (
    <>
      <Header />

      <div className="category-heading">
        <p className="category-title">Categories</p>
        <div className="category-heading-links">
          <span>
            <Link to={`/`} style={{ color: "var(--black)" }}>
              home /&nbsp;
            </Link>
          </span>
          <span>
            <Link
              to={`/category/${categoryId}`}
              style={{ color: "var(--black)" }}
            >
              {categoryId}
            </Link>
          </span>
        </div>
      </div>

      <section className="products-page">
        <ul className="category-links">
          {product_categories.map((category) => {
            return (
              <Link
                key={category}
                style={{
                  color: category === categoryId ? "red" : "var(--black)",
                  textDecoration:
                    category === categoryId ? "underline" : "none",
                }}
                to={`/category/${category}`}
              >
                <li id={`${category}`} className="category-link">
                  {category === "all_products" ? `all products` : category}
                </li>
              </Link>
            );
          })}
        </ul>
        <section className="products-container">
          {isFetching ? (
            <Loader isLoading={isFetching} />
          ) : products?.length > 0 ? (
            <section className="inner-products-container">
              {products.map((product) => {
                return (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    style={{ color: "var(--black)" }}
                  >
                    <div id="product">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        style={{ display: "block", width: "100%" }}
                        loading="lazy"
                      />

                      <div className="product-text">
                        <p className="name">{product.name}</p>
                        <p className="price">&#8358;{product.price}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </section>
          ) : (
            <div className="nil-products">
              <div>
                <p>No Products</p>
                <Link
                  to={`/`}
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  Keep Shopping.
                </Link>
              </div>
            </div>
          )}
        </section>
      </section>

      <Footnote />
      <Footer />
    </>
  );
};

export default Products;
