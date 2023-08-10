import React, { useState } from "react";
import ServiceCard from "../ServiceCard/ServiceCard";
import { Link } from "react-router-dom";
import "./ServicesGrid.css";
import SubNavbar from "../SubNavbar/SubNavbar";
import ServiceHero from "../ServiceHero/ServiceHero";

function ServicesGrid({ services }) {
  const [servicesShown, setServicesShown] = useState(services);
  let service = servicesShown && servicesShown[0];

  return (
    <div>
      <SubNavbar services={servicesShown} setServices={setServicesShown} />
      <div className="services-container">
        <div className="service-grid">

          {servicesShown?.map(service => <div className='card'> <ServiceCard id= {service.id} service={service}/>
            </div>)}
        </div>
      </div>
    </div>
  );

}

export default ServicesGrid;
