import React,{useState, useEffect} from 'react'
import apiClient from '../../services/apiClient'
import './OrderReceivedCard.css'

function OrderReceivedCard({orderId, items}) {

    const [showDetails, setShowDetails] = useState(false)
    const [user, setUser] = useState()
    useEffect(()=>{
        const getUser = async () => {
            if (items){
                const item= items[0]
                const user= await apiClient.fetchUserById(item.user_id)
                console.log('in use effect', user.data.user)
                setUser(user?.data?.user)
            }
        }
        getUser()
    }, [])

    return (
        <div className='order-received-card'>
            <div className='card-header'>
            <img className='user-hero' src={'https://www.pngitem.com/pimgs/m/146-1468843_profile-icon-orange-png-transparent-png.png'}/>

                {/* <img className='service-hero' src={'https://bloximages.newyork1.vip.townnews.com/sandiegomagazine.com/content/tncms/assets/v3/editorial/d/8c/d8c6d926-72fb-11eb-a628-efc4e9abab37/6030319469eb5.image.jpg?resize=1200%2C900'}/> */}
                <div className='order-caption'>
                    <h1> {`${user?.first_name} ${user?.last_name}`}  </h1>
                    <p> Ordered {items[0].date} </p>
                </div>
            </div>
            
            {
                showDetails? 
                <div>
                    <div className='ordered-items'> 
                {items.map((item)=>{
                    return (
                        <div className='order-details'>
                            <img src={item.image_url}/>  
                            <div className='amount-and-name'>
                                <span className='quantity'> <span> {item.quantity} </span> </span>
                                <span> {item.product_name} </span>
                            </div>
                            <p> ${`${item.cost}     ea.`}  </p>
                            {/* <p> {item.image_url} </p> */}

                        </div>

                    )
                })}
                </div>
            <p className= 'view-details' onClick={()=> setShowDetails(false)}> Show less </p>
                
                </div>
                
                :
            <p className= 'view-details' onClick={()=> setShowDetails(true)}> View order details</p>
                
            }
        </div>
    )
}

export default OrderReceivedCard
