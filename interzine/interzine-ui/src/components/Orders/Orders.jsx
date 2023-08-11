import React, { useEffect } from "react";
import apiClient from "../../services/apiClient";
import OrderCard from "../OrderCard/OrderCard";
import "./Orders.css";
import { useNavigate } from "react-router-dom";

function Orders({ orders, services }) {
  const groupedById = {};
  const sortedOrders = orders?.toSorted()?.reverse();
  const navigate = useNavigate();

  useEffect(() => {}, [orders]);

  if (orders) {
    for (const order of orders) {
      if (order.order_id in groupedById) {
        groupedById[order.order_id].push(order);
      } else {
        groupedById[order.order_id] = [order];
      }
    }
  }

  const reversed = Object.entries(groupedById)?.sort((a, b) => {
    return b[0] - a[0];
  });

  return (
    <div className="orders">
      {orders.length > 0 ? (
        reversed?.map(([order_id, items]) => {
          const provider = services?.find(
            (service) => items[0].provider_id === service.id
          );
          return (
            <OrderCard provider={provider} order_id={order_id} items={items} />
          );
        })
      ) : (
        <div className="empty-orders">
          <h1> No orders yet.</h1>
          <p
            onClick={() => {
              navigate("/");
            }}
          >
            {" "}
            Head to Intersinee shop to order
          </p>
        </div>
      )}
    </div>
  );
}

export default Orders;
