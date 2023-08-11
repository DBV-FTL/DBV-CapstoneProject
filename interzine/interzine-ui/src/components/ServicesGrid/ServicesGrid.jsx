import React, { useState } from "react";
import ServiceCard from "../ServiceCard/ServiceCard";
import { Link } from "react-router-dom";
import "./ServicesGrid.css";
import SubNavbar from "../SubNavbar/SubNavbar";
import ServiceHero from "../ServiceHero/ServiceHero";
import Bot from "../Bot/Bot";
import BotImg from "../../assets/bot.png"

function ServicesGrid({ services }) {
  const [servicesShown, setServicesShown] = useState(services);
  const [showChatBot, setShowChatBot] = useState(false);
  let service = servicesShown && servicesShown[0];
  const handleToggleChatBot = () => {
    setShowChatBot((prevShowChatBot) => !prevShowChatBot);
  };

  return (
    <div>
      <SubNavbar services={servicesShown} setServices={setServicesShown} />
      <div className="services-container">
        <div className="service-grid">
          {servicesShown?.map((service) => (
            <div className="card">
              {" "}
              <ServiceCard id={service.id} service={service} />
            </div>
          ))}
        </div>
      </div>
      <div className="chat">
        <div className="image-container">
          {showChatBot ? <Bot /> : null}
          <img
            src={BotImg}
            alt=""
            className="bot-img"
            onClick={handleToggleChatBot}
          />
        </div>
      </div>
    </div>
  );
}

export default ServicesGrid;
