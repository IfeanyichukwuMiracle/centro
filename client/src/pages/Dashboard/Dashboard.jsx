import { useEffect, useState, useContext } from "react";
import {
  DCard,
  Footer,
  Footnote,
  Header,
  Loader,
  Order,
  ProductCard,
} from "../../components";
import axios from "axios";
import "./dashboard.css";
import { AppContext } from "../../context/AppContextProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { dashboard_ids, product_categories } from "../../data";
import toast, { Toaster } from "react-hot-toast";

const new_categories = product_categories.filter(
  (ctg) => ctg !== "all_products"
);

const Dashboard = () => {
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [products, setProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [fulfilledOrders, setFulfilledOrders] = useState([]);
  const { state } = useContext(AppContext);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    specification: "",
    price: "",
    quantity: "",
    category: "",
    files: [],
  });

  function handleOnChange(e) {
    setProduct((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

  async function getData(url, setFunc, auth) {
    setIsFetching(true);
    try {
      const res = await axios.get(
        url,
        auth && { headers: { Authorization: `Bearer ${state.token}` } }
      );
      setFunc(res.data.data);
      // console.log(res.data.data);
      setIsFetching(false);
    } catch (e) {
      console.log(e.response.data);
      setIsFetching(false);
      return;
    }
  }

  async function fulfillOrder(id) {
    const toastId = toast.loading("Fulfilling Order!");
    try {
      await axios.patch(
        `https://centro-api.onrender.com/api/v1/order/${id}`,
        {},
        { headers: { Authorization: `Bearer ${state.token}` } }
      );
      toast.dismiss(toastId);
      toast.success("Order fulfilled!");
      window.location.reload();
    } catch (e) {
      toast.dismiss(toastId);
      toast.error(e.response.data.message);
      return;
    }
  }

  async function addProduct(e) {
    e.preventDefault();

    const toastId = toast.loading("Adding product.");
    const { files, ...rest } = product;
    const keys = Object.keys(rest);
    const values = Object.values(rest);

    if (values.includes("") || files.length === 0) {
      toast.dismiss(toastId);
      toast.error(`Fill the fields!`);
      return;
    }
    const form_data = new FormData();
    for (let i = 0; i < keys.length; i++) {
      form_data.append(keys[i], product[keys[i]]);
    }
    for (let i = 0; i < files.length; i++) {
      form_data.append(`files`, files[i]);
    }
    // console.log(form_data);

    try {
      await axios.post(
        `https://centro-api.onrender.com/api/v1/product/post`,
        form_data,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.dismiss(toastId);
      toast.success(`Product added!`);
      setProduct({
        name: "",
        description: "",
        specification: "",
        price: "",
        quantity: "",
        category: "",
        files: [],
      });
      setTimeout(() => {
        navigate(`/dashboard/products`);
      }, 1200);
      return;
    } catch (e) {
      toast.dismiss(toastId);
      toast.error(e.response.data.message);
      return;
    }
  }

  useEffect(() => {
    if (
      !dashboard_ids.find((id) => id === dashboardId) ||
      state.role !== "admin"
    ) {
      navigate("/error");
      return;
    }
    if (dashboardId === "add") return;
    getData(
      `https://centro-api.onrender.com/api/v1/product`,
      setProducts,
      false
    );
    getData(
      `https://centro-api.onrender.com/api/v1/order/pending`,
      setPendingOrders,
      true
    );
    getData(
      `https://centro-api.onrender.com/api/v1/order/fulfilled`,
      setFulfilledOrders,
      true
    );
  }, [dashboardId]);
  return (
    <>
      <Header />
      <Toaster />

      <section className="dashboard-header">
        <p>{dashboardId}</p>
        <ul>
          <Link to={`/`} style={{ color: "var(--black)" }}>
            <li>home /&nbsp;</li>
          </Link>
          <Link
            to={`/dashboard/${dashboardId}`}
            style={{ color: "var(--black)" }}
          >
            <li>{dashboardId}</li>
          </Link>
        </ul>
      </section>

      <section className="dashboard">
        <ul>
          {dashboard_ids.map((id) => {
            if (id === "pending" || id === "fulfilled") {
              return (
                <Link key={id} to={`/dashboard/${id}`}>
                  <li
                    style={{
                      color: id === dashboardId ? "red" : "var(--black)",
                      textDecoration: id === dashboardId ? "underline" : "none",
                    }}
                  >
                    {id} orders
                  </li>
                </Link>
              );
            } else if (id === "add") {
              return (
                <Link key={id} to={`/dashboard/${id}`}>
                  <li
                    style={{
                      color: id === dashboardId ? "red" : "var(--black)",
                      textDecoration: id === dashboardId ? "underline" : "none",
                    }}
                  >
                    {id} product
                  </li>
                </Link>
              );
            }
            return (
              <Link key={id} to={`/dashboard/${id}`}>
                <li
                  style={{
                    color: id === dashboardId ? "red" : "var(--black)",
                    textDecoration: id === dashboardId ? "underline" : "none",
                  }}
                >
                  {id}
                </li>
              </Link>
            );
          })}
        </ul>
        <section className="dashboard-container">
          {dashboardId === "overview" ? (
            isFetching ? (
              <Loader isLoading={isFetching} />
            ) : (
              <section className="inner-products-container">
                <Link
                  to={`/dashboard/products`}
                  style={{ color: "var(--black)" }}
                >
                  <DCard type={"Total Products"} data={products} />
                </Link>
                <Link
                  to={`/dashboard/pending`}
                  style={{ color: "var(--black)" }}
                >
                  <DCard type={"Pending Orders"} data={pendingOrders} />
                </Link>
                <Link
                  to={`/dashboard/fulfilled`}
                  style={{ color: "var(--black)" }}
                >
                  <DCard type={"Fulfilled Orders"} data={fulfilledOrders} />
                </Link>
              </section>
            )
          ) : (
            ""
          )}
          {dashboardId === "products" ? (
            isFetching ? (
              <Loader isLoading={isFetching} />
            ) : (
              <section className="inner-products-container">
                {products.map((product) => {
                  return <ProductCard key={product._id} product={product} />;
                })}
              </section>
            )
          ) : (
            ""
          )}
          {dashboardId === "pending" ? (
            isFetching ? (
              <Loader isLoading={isFetching} />
            ) : (
              <section className="pending-orders-container">
                {pendingOrders.length > 0 ? (
                  pendingOrders.map((order) => {
                    return (
                      <Order
                        key={order._id}
                        order={order}
                        fulfillOrder={fulfillOrder}
                        isFulfilled={false}
                      />
                    );
                  })
                ) : (
                  <>
                    <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      No Pending Orders!
                    </p>
                    <Link
                      to={`/dashboard/overview`}
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      Go to overview.
                    </Link>
                  </>
                )}
              </section>
            )
          ) : (
            ""
          )}
          {dashboardId === "fulfilled" ? (
            isFetching ? (
              <Loader isLoading={isFetching} />
            ) : (
              <section className="pending-orders-container">
                {fulfilledOrders.length > 0 ? (
                  fulfilledOrders.map((order) => {
                    return (
                      <Order
                        key={order._id}
                        order={order}
                        fulfillOrder={fulfillOrder}
                        isFulfilled={true}
                      />
                    );
                  })
                ) : (
                  <>
                    <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      No Fulfilled Orders!
                    </p>
                    <Link
                      to={`/dashboard/overview`}
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      Go to overview.
                    </Link>
                  </>
                )}
              </section>
            )
          ) : (
            ""
          )}
          {dashboardId === "add" && (
            <>
              <form
                encType="multipart/form-data"
                className="add-products-form"
                onSubmit={(e) => {
                  addProduct(e);
                }}
              >
                <div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Product name"
                    value={product.name}
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
                    value={product.description}
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
                    value={product.specification}
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
                    value={product.price}
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
                    value={product.quantity}
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
                      setProduct((prevData) => ({
                        ...prevData,
                        [e.target.name]: [...e.target.files],
                      }));
                    }}
                  />
                </div>
                <button type="submit" id="add-product-btn">
                  Add
                </button>
              </form>
            </>
          )}
        </section>
      </section>

      <Footnote />
      <Footer />
    </>
  );
};

export default Dashboard;
