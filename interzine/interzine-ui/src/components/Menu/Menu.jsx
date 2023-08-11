import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FoodCard from "../FoodCard/FoodCard";
import "./Menu.css";
import ServiceHero from "../ServiceHero/ServiceHero";
import apiClient from "../../services/apiClient";

function Menu(props) {
  let menu;
  let provider;
  let client;

  if (props.menu) {
    menu = props.menu;
    provider = props.provider;
    client = "provider";
  } else {
    const [userMenu, setUserMenu] = useState();
    const { id } = useParams();

    useEffect(() => {
      apiClient.fetchMenuItems(id).then((response) => {
        setUserMenu(response?.data?.menuItems);
        props.setMenus((prev) => prev.concat(response?.data?.menuItems));
      });
    }, []);
    menu = userMenu;
    provider = props.services.find((provider) => provider.id === parseInt(id));
    client = "user";
  }

  return (
    <>
      {!props.menu && <ServiceHero provider={provider} client={"user"} />}

      <div className="menu">
        {menu?.map((food) => (
          <FoodCard food={food} client={client} />
        ))}
      </div>
    </>
  );
}

export default Menu;
