import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FoodDetail.css";
import apiClient from "../../services/apiClient";

function FoodDetail({ cart, addToCart }) {
  const navigate = useNavigate();

  const { id } = useParams();

  function handleIncrement() {
    addToCart((prev) => {
      if (id in cart) {
        return { ...prev, cart: { ...cart, [id]: cart[id] + 1 } };
      } else {
        return { ...prev, cart: { ...cart, [id]: 1 } };
      }
    });
  }

  function handleDecrement() {
    addToCart((prev) => {
      if (id in cart && cart[id] > 0) {
        return { ...prev, cart: { ...cart, [id]: cart[id] - 1 } };
      } else {
        return { ...prev, cart: { ...cart, [id]: 0 } };
      }
    });
  }

  const [food, setFood] = useState();

  useEffect(() => {
    apiClient.fetchMenuItem(id).then((response) => {
      setFood(response?.data.menuItem);
    });
  }, []);

  function routeToMenu() {
    navigate(`/menu/${food?.service_provider_id}`);
  }

  return (
    <div className="food-detail">
      <div className="exit-page" onClick={routeToMenu}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />
        <span class="material-symbols-outlined close">close</span>
      </div>

      {/* <button className='exit-page' onClick={routeToMenu}> X </button> */}
      <img src={food?.image_url} />
      <div className="details">
        <div className="sub">
          <h1> {food?.name} </h1>
          <h3> ${food?.cost} </h3>
          <p> This food is yummy and scrumptious!</p>
          <span className="rating">
            <span>
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
              />
              <span className="material-symbols-outlined star">star_rate</span>
            </span>
            {food?.rating}
          </span>
        </div>
        <div className="larger-buttons-container">
          <div className="buttons-container">
            <button className="button" onClick={handleDecrement}>
              {" "}
              -{" "}
            </button>
            <p> {id in cart ? cart[id] : 0} </p>
            <button className="button" onClick={handleIncrement}>
              {" "}
              +{" "}
            </button>
          </div>

          <button className="add-to-cart"> Add to cart</button>
        </div>
      </div>
    </div>
  );
}

export default FoodDetail;
