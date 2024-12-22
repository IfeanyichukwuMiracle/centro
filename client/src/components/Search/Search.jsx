import "./search.css";
import Loader from "../Loader/Loader";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Search = ({ setShowSearch }) => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  async function onFormSearch(e) {
    setResult(null);
    e.preventDefault();
    setIsFetching(true);

    try {
      const response1 = await axios.get(
        `http://localhost:9000/api/v1/product?category=${search.toLowerCase()}`
      );
      const response2 = await axios.get(
        `http://localhost:9000/api/v1/product?name=${search.toLowerCase()}`
      );

      const response =
        (response1.data.data.length > 0 && response1.data.data) ||
        (response2.data.data.length > 0 && response2.data.data) ||
        [];
      setResult(response);
      setIsFetching(false);
    } catch (e) {
      console.log(e.response.data);
      toast.error(`Check connection and try again!`);
      return;
    }
  }

  return (
    <>
      <Toaster />
      <section className="search-container">
        <form method="post">
          <div id="search-close-btn" onClick={() => setShowSearch(false)}>
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="search-content">
            <p className="search-heading">Search our store</p>
            <div id="inner-search">
              <input
                type="text"
                name="search"
                id="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Enter Search"
              />
              <button
                type="submit"
                onClick={(e) => {
                  onFormSearch(e);
                }}
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <Loader size={20} margin={-0} isLoading={isFetching} />
          <section className="search-list">
            {result !== null ? (
              <>
                {result.length > 0 ? (
                  <>
                    {result.map((product) => {
                      return (
                        <a
                          key={product._id}
                          href={`/product/${product._id}`}
                          style={{ color: "var(--black)" }}
                        >
                          <div className="search-product">
                            <img
                              src={product.image[0]}
                              alt={product.name}
                              style={{
                                display: "block",
                                width: "4rem",
                              }}
                            />
                            <p className="search-product-name">
                              {product.name}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </>
                ) : (
                  "No product"
                )}
              </>
            ) : (
              ""
            )}
          </section>
        </form>
      </section>
    </>
  );
};

export default Search;
