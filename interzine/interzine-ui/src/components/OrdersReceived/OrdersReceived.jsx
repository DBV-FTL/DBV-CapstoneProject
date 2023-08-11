import React from "react";
import OrderCard from "../OrderCard/OrderCard";
import OrderReceivedCard from "../OrderReceivedCard/OrderReceivedCard";
import "./OrdersReceived.css";

function OrdersReceived({ ordersReceived }) {
  // const ordersRec= orders?.filter((order)=> order.provider_id===provider.id)
  const groupedById = {};

  if (ordersReceived) {
    for (const order of ordersReceived) {
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
    <div className="orders-received">
      {reversed?.map(([orderId, items]) => (
        <OrderReceivedCard items={items} orderId={orderId} />
      ))}
    </div>
  );
}

export default OrdersReceived;
