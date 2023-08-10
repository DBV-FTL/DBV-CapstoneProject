import React from 'react'
import './ServiceCard.css'

import { Link } from 'react-router-dom'

function ServiceCard({service}) {
    return (
        <>
    
        <div className='service-card'>
    <div className='service-info'>
          <Link to={`/menu/${service.id}`} className='service-link'>
            <img className='service-image' src={'https://furtherafrica.com/content-files/uploads/2022/07/ethiopia_food.jpg'} />
          </Link>
            <div className='service-details'>
                <div className='column'>
              <h2 className="servicenm">{service.name} {service.cost}</h2>
              <h2 className="servicenm">{service.cuisine} || {service.rating}</h2>
            </div>
            <img className='provider-image' src={service.profile_picture} />
            </div>
          </div>
        </div>
        </>
      );
}

export default ServiceCard
