import { useContext, useEffect, useState } from "react";
import {
  Cart,
  Footer,
  Footnote,
  Header,
  Loader,
  Wishlist,
  ProductCard,
} from "../../components";
import "./product.css";
import axios from "axios";
import { AppContext } from "../../context/AppContextProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { product_categories } from "../../data";

const new_categories = product_categories.filter(
  (ctg) => ctg !== "all_products"
);

import toast, { Toaster } from "react-hot-toast";

const Product = () => {
  const { productId } = useParams();
  const { dispatch, state } = useContext(AppContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [showText, setShowText] = useState({ desc: false, specs: false });
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    specification: "",
    price: "",
    quantity: "",
    category: "",
    files: [],
  });
  const [products, setProducts] = useState([]);
  const [isGetting, setIsGetting] = useState(false);

  async function getMore(category) {
    setIsGetting(true);
    try {
      const res = await axios.get(
        `http://localhost:9000/api/v1/product?category=${category}&limit=4`
      );
      setProducts(res.data.data);
      setIsGetting(false);
      return;
    } catch (e) {
      console.log(e.response);
      setIsGetting(false);
      return;
    }
  }

  function addToCart() {
    const foundProduct = state.cart.find((item) => item._id === product._id);
    if (!foundProduct) {
      dispatch({ type: "add_to_cart", payload: product });
      setShowCart(true);
      toast.success(`Added to cart!`);
      return;
    }
    toast.error(`Product already in cart!`);
  }

  function handleOnChange(e) {
    setEditProduct((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

  function buyNow() {
    const foundProduct = state.cart.find((item) => item._id === product._id);
    if (!foundProduct) {
      dispatch({ type: "add_to_cart", payload: product });
      toast.success(`Added to cart!`);
      setTimeout(() => {
        navigate("/checkout");
      }, 1500);
      return;
    }
    toast.error(`Product already in cart!`);
  }

  async function fetchProduct() {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `http://localhost:9000/api/v1/product/${productId}`
      );
      setProduct(response.data.data);
      setEditProduct(() => {
        const newObj = { ...response.data.data };
        delete newObj["image"];
        delete newObj["deleted"];
        delete newObj["_id"];
        delete newObj["__v"];
        return { ...newObj };
      });
      await getMore(response.data.data.category);
      setIsFetching(false);
    } catch (e) {
      setIsFetching(false);
      console.log(e.response.data);
      return;
    }
  }

  async function fetchReviews() {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/v1/review/${productId}`
      );
      setReviews(response.data.data);
    } catch (e) {
      console.log(e.response.data);
      return;
    }
  }

  async function sendReview(e) {
    e.preventDefault();
    if (!review) {
      toast.error(`Field empty!`);
      return;
    }
    try {
      await axios.post(
        `http://localhost:9000/api/v1/review/${productId}`,
        { review },
        { headers: { Authorization: `Bearer ${state.token}` } }
      );
      toast.success(`Review sent!`);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {
      toast.error(`${e.response.data.message}! to send review`);
      return;
    }
  }

  function changeImgIndex(e) {
    setImgIndex(+e.target.className);
  }

  async function deleteProduct(id) {
    const toastId = toast.loading("Deleting product.");
    try {
      await axios.patch(
        `http://localhost:9000/api/v1/product/delete/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      toast.dismiss(toastId);
      toast.success("Product deleted!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    } catch (e) {
      toast.dismiss(toastId);
      toast.error(e.response.data.message);
      return;
    }
  }

  async function addProduct(e) {
    e.preventDefault();

    const toastId = toast.loading("Editing product.");
    const { files, ...rest } = editProduct;
    const keys = Object.keys(rest);

    const form_data = new FormData();
    for (let i = 0; i < keys.length; i++) {
      if (editProduct[keys[i]] !== "") {
        form_data.append(keys[i], editProduct[keys[i]]);
      }
    }
    for (let i = 0; i < files?.length; i++) {
      form_data.append(`files`, files[i]);
    }

    try {
      await axios.patch(
        `http://localhost:9000/api/v1/product/${product._id}`,
        form_data,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.dismiss(toastId);
      toast.success(`Product edited!`);
      setEditProduct({
        name: "",
        description: "",
        specification: "",
        price: "",
        quantity: "",
        category: "",
        files: [],
      });
      setTimeout(() => {
        window.location.href = `/product/${productId}`;
      }, 1200);
      return;
    } catch (e) {
      toast.dismiss(toastId);
      toast.error(e.response.data.message);
      return;
    }
  }

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    getMore();
  }, [productId]);

  return (
    <>
      <Header />
      <Toaster />

      {showCart && <Cart showCart={showCart} setShowCart={setShowCart} />}
      {showWishlist && (
        <Wishlist
          showWishlist={showWishlist}
          setShowWishlist={setShowWishlist}
        />
      )}

      <section className="product-container">
        {isFetching ? (
          <Loader isLoading={isFetching} />
        ) : (
          <>
            <ul className="product-links">
              <li>
                <Link to={`/`} style={{ color: "var(--black)" }}>
                  Home{" "}
                </Link>
              </li>
              <li>
                /{" "}
                <Link
                  to={`/product/${product._id}`}
                  style={{ color: "var(--black)" }}
                >
                  {product.name}
                </Link>
              </li>
            </ul>

            <div className="product-details-container">
              <div className="product-image">
                <img
                  src={product?.image?.[imgIndex]}
                  id="main-img"
                  alt="an image"
                  loading="lazy"
                />
                <div className="other-images">
                  {product?.image?.length > 0 &&
                    product?.image?.map((item) => {
                      return (
                        <img
                          src={item}
                          alt={product.name}
                          key={product?.image?.indexOf(item)}
                          loading="lazy"
                          className={product?.image?.indexOf(item)}
                          onClick={(e) => {
                            changeImgIndex(e);
                          }}
                        />
                      );
                    })}
                </div>
              </div>
              <div className="product-details">
                <div id="product-head">
                  <p className="product-details-name">{product.name}</p>
                  <div className="wishlist-icon" title="wishlist">
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
                  </div>
                </div>
                <p className="product-details-price">&#8358;{product.price}</p>
                <div className="product-details-description">
                  <p className="desc-title">Description</p>
                  {product?.description?.length > 100 ? (
                    <p className="description">
                      {showText.desc ? (
                        <>
                          {product.description}
                          <span
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => {
                              setShowText((prev) => ({ ...prev, desc: false }));
                            }}
                          >
                            {" "}
                            read less...
                          </span>
                        </>
                      ) : (
                        <>
                          {product.description.substring(0, 100)}
                          <span
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => {
                              setShowText((prev) => ({ ...prev, desc: true }));
                            }}
                          >
                            {" "}
                            read more...
                          </span>
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="description">{product.description}</p>
                  )}
                </div>
                <div className="product-details-specs">
                  <p className="specs-title">Specifications</p>
                  {product?.specification &&
                  product?.specification.length > 100 ? (
                    <p className="specs">
                      {showText.specs ? (
                        <>
                          {product?.specification}
                          <span
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => {
                              setShowText((prev) => ({
                                ...prev,
                                specs: false,
                              }));
                            }}
                          >
                            {" "}
                            read less...
                          </span>
                        </>
                      ) : (
                        <>
                          {product?.specification?.substring(0, 100)}
                          <span
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => {
                              setShowText((prev) => ({ ...prev, specs: true }));
                            }}
                          >
                            {" "}
                            read more...
                          </span>
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="description">
                      {product?.specification || `30gb ROM - 38gb RAM`}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  id="add-btn"
                  onClick={() => {
                    addToCart();
                  }}
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  id="buy-btn"
                  onClick={() => {
                    buyNow();
                  }}
                >
                  Buy Now
                </button>
                {state.token && state.role === "admin" && (
                  <button
                    id="delete-btn"
                    style={{ display: "block" }}
                    onClick={() => {
                      deleteProduct(product._id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        <div className="reviews-section">
          <div className="reviews-section-container">
            <p className="reviews-title">Reviews</p>
            <form method="post">
              <textarea
                name="review"
                id="review"
                cols={15}
                placeholder="Post Review"
                value={review}
                onChange={(e) => {
                  setReview(e.target.value);
                }}
                required={true}
              ></textarea>
              <div>
                <button
                  type="submit"
                  onClick={(e) => {
                    sendReview(e);
                  }}
                >
                  Send review
                </button>
              </div>
            </form>
            <section className="reviews">
              {reviews.length > 0 ? (
                reviews
                  .map((item) => {
                    return (
                      <div className="review" key={item._id}>
                        <div className="review-title">
                          <p className="user">{item.user.firstname}</p>
                          <p className="date">
                            {new Date(item.createdAt).toLocaleDateString() +
                              " " +
                              new Date(item.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="review-body">{item.review}</div>
                      </div>
                    );
                  })
                  .reverse()
              ) : (
                <p>Be the first to send a review ⬆</p>
              )}
            </section>
          </div>
          {state.token && state.role === "admin" && (
            <form
              encType="multipart/form-data"
              className="add-products-form edit-form"
              onSubmit={(e) => {
                addProduct(e);
              }}
            >
              <p className="edit-form-heading">Edit Product</p>
              <p className="edit-form-subheading">
                Fill the field(s) you want edited*
              </p>
              <div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Product name"
                  value={editProduct.name}
                  onChange={(e) => {
                    handleOnChange(e);
                  }}
                />
              </div>
              <div>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={editProduct.description}
                  onChange={(e) => {
                    handleOnChange(e);
                  }}
                ></textarea>
              </div>
              <div>
                <textarea
                  name="specification"
                  id="specification"
                  placeholder="Specs"
                  value={editProduct.specification}
                  onChange={(e) => {
                    handleOnChange(e);
                  }}
                ></textarea>
              </div>
              <div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Price"
                  value={editProduct.price}
                  onChange={(e) => {
                    handleOnChange(e);
                  }}
                />
              </div>
              <div>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Qty"
                  value={editProduct.quantity}
                  onChange={(e) => {
                    handleOnChange(e);
                  }}
                />
              </div>
              <div>
                <select
                  name="category"
                  id="category"
                  onChange={(e) => {
                    handleOnChange(e);
                  }}
                >
                  <option value="">--Select Category--</option>
                  {new_categories.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="files" id="select-img-btn">
                  Select Image(s)
                </label>
                <input
                  type="file"
                  multiple
                  name="files"
                  style={{ display: "none" }}
                  id="files"
                  onChange={(e) => {
                    setEditProduct((prevData) => ({
                      ...prevData,
                      [e.target.name]: [...e.target.files],
                    }));
                  }}
                />
              </div>
              <button type="submit" id="add-product-btn">
                Edit
              </button>
            </form>
          )}
        </div>

        <div className="more-section">
          <p className="more-title">You might like also</p>
          {isGetting ? (
            <Loader isLoading={isGetting} />
          ) : (
            products.length > 0 && (
              <div className="more-section-products">
                {products.map((product) => {
                  return <ProductCard key={product._id} product={product} />;
                })}
              </div>
            )
          )}
        </div>
      </section>

      <Footnote />
      <Footer />
    </>
  );
};

export default Product;
