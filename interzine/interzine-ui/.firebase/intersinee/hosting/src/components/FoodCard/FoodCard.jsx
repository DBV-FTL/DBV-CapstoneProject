import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './FoodCard.css'
import FoodDetail from '../FoodDetail/FoodDetail'

function FoodCard({food, setShowModal}) {
    const navigate= useNavigate()
    

    function openModal(e){
        e.preventDefault()
        // navigate(`/shop/food/${food.id}`)
        // return <FoodDetail food={food}/>
    }


    return (
        <div className='food-card'>
            <Link to={`/food/${food.id}`}> <img className='food-image' src={food.image_url} /> </Link>
            <div>
                <h3> {food.name} </h3>
                <h3> ${parseInt(food.cost).toFixed(2)} </h3>
            </div>
            {/* <FoodDetail food={food} setShowModal={setShowModal}/> */}
            
        </div>
    )
}

export default FoodCard
