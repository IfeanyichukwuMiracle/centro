import { useState } from "react";
import { ProductCard } from "../../components";

const Order = ({ order, fulfillOrder, isFulfilled }) => {
  const [view, setView] = useState(false);

  return (
    <>
      <div className="pending-order">
        <div className="pending-order-heading">
          <p className="pending-order-name">
            {`${order.firstname} ${order.lastname}`}
          </p>
          <p className="pending-order-email">{order.email}</p>
          <p className="pending-order-phone">{order.phone}</p>
          <p className="pending-order-date">
            {`${new Date(order.createdAt).toLocaleDateString()} ${new Date(
              order.createdAt
            ).toLocaleTimeString()}`}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            id="icon"
            onClick={() => {
              setView(!view);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
        {view && (
          <>
            <div className="pending-order-body">
              <p className="pending-order-address">
                {`${order.street_address}, ${order.town}, ${order.state} state.`}
              </p>
              <div className="pending-order-products">
                {order.products.map((product) => {
                  return <ProductCard product={product} key={product._id} />;
                })}
              </div>
            </div>
            {isFulfilled ? (
              <div className="fulfilled-tag">Delivered</div>
            ) : (
              <button
                id="fulfill-btn"
                onClick={() => {
                  fulfillOrder(order._id);
                }}
              >
                Deliver
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Order;
