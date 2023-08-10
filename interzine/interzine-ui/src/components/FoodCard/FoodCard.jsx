import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './FoodCard.css'
import FoodDetail from '../FoodDetail/FoodDetail'

function FoodCard({food, client}) {
    

    return (
        <div className='food-card'>
            {   client==='user'?
                  <Link to={`/food/${food.id}`}> <img className='food-image' src={food.image_url} /> </Link>
                  :
                  <img className='food-image' src={food.image_url} />  
            }
            

            <div>
                <div className='FCname'>
                <h3> {food.name} </h3>
                </div>
                <h4> ${parseInt(food.cost).toFixed(2)} </h4>
            </div>
            
        </div>
    )
}

export default FoodCard
