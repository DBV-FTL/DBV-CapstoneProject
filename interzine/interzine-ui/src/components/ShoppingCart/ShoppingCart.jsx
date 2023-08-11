import React, { useState } from "react";
import apiClient from "../../services/apiClient";
import "./ShoppingCart.css";

function ShoppingCart({ setAppState, appState, cart, menus, services }) {
  let total = 0;
  // const [itemsInCart, setItemsInCart] = useState([])
  let itemsInCart = [];

  async function order() {
    const ordered = await apiClient.checkoutFoods(itemsInCart);
    setAppState({
      ...appState,
      cart: {},
      prevOrders: [...appState.prevOrders, ordered],
    });
  }

  const firstFood = menus?.find(
    (food) => food.id === parseInt(Object.keys(cart)[0])
  );

  const provider = services?.find(
    (service) => service.id === firstFood?.service_provider_id
  );

  return (
    <div className="shopping-cart">
      {Object.keys(cart)?.length > 0 ? (
        <div>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
          />
          <p className="cart-from"> Your cart from</p>
          <h1 className="provider-name"> {provider.name} </h1>
          {Object.entries(cart)?.map(([id, quantity]) => {
            const foodInCart = menus?.find((food) => food.id === parseInt(id));
            // const provider= services.find((service) => service.id=== foodInCart.service_provider_id)
            const orderDate = new Date();
            itemsInCart = [
              ...itemsInCart,
              {
                product_name: foodInCart.name,
                service_provider_id: foodInCart.service_provider_id,
                quantity,
                date: `${orderDate.toLocaleString("default", {
                  month: "long",
                })} ${orderDate.getDate()}, ${orderDate.getFullYear()}`,
              },
            ];
            total += foodInCart.cost * quantity;
            // setItemsInCart([...itemsInCart, {product_name: foodInCart.name, service_provider_id: foodInCart.service_provider_id, quantity}])
            return (
              <div className="item-container">
                <div className="food-in-cart-details">
                  <img className="food-image" src={foodInCart.image_url} />
                  <div className="name-cost">
                    <p className="food-name"> {foodInCart.name} </p>
                    {/* need food details field */}
                    <p className="food-cost"> {`$${foodInCart.cost}`} </p>
                  </div>
                </div>
                {/* <p> {`${provider.name}`} </p> */}
                <div className="quantity-buttons">
                  {quantity === 1 ? (
                    <span className="material-symbols-outlined delete">
                      delete
                    </span>
                  ) : (
                    <span class="material-symbols-outlined controls">
                      remove
                    </span>
                  )}

                  <p className="item-quantity"> {quantity} </p>
                  <span class="material-symbols-outlined controls">add</span>
                </div>
              </div>
            );
          })}
          <h3> Total: {`$${total.toFixed(2)}`} </h3>

          <button className="checkout-button" onClick={() => order()}>
            {" "}
            Proceed to checkout{" "}
          </button>
        </div>
      ) : (
        <div className="empty-cart-container">
          <h2> Your Intersinee cart is empty.</h2>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
          />
          <div className="empty-cart-icon">
            <span className="material-symbols-outlined emptycart">
              shopping_cart
            </span>
          </div>
          {/* <img src='https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fshopping-cart_8865579&psig=AOvVaw2rjKr3bwJDVMpvJbwZB_J8&ust=1691524637687000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCMCqlr6qy4ADFQAAAAAdAAAAABAE' /> */}
          <p> Add items from Sineers to start a new cart.</p>
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;
