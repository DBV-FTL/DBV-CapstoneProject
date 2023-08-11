import React from "react";
import "./ServiceCard.css";

import { Link } from "react-router-dom";

function ServiceCard({ service }) {
  return (
    <>
      <div className="service-card">
        <div className="service-info">
          <Link to={`/menu/${service?.id}`} className="service-link">
            <img
              className="service-image"
              src={
                service?.service_provider_hero
                  ? service?.service_provider_hero
                  : "https://cms-b-assets.familysearch.org/dims4/default/bf2d93e/2147483647/strip/true/crop/800x500+0+0/resize/2480x1550!/format/webp/quality/90/?url=https%3A%2F%2Ffamilysearch-brightspot.s3.amazonaws.com%2F89%2F3f%2F1a23c4a6fe52a96d2a6d2586cb90%2Fworld-cuisine.jpg"
              }
            />
          </Link>
          <div className="service-details">
            <div className="column">
              <h2 className="service-name">{service?.name} </h2>
              {/* <p className='service-rating'> {service.rating}</p> */}
              <p className="service-cuisine">{service?.cuisine}</p>
            </div>
            <div className="provider-image-container">
              {" "}
              <img
                className="provider-image"
                src={service?.profile_picture}
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceCard;
