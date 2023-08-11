import React from 'react'
import apiClient from '../../services/apiClient'
import OrderCard from '../OrderCard/OrderCard'
import './Orders.css'

function Orders({orders, services}) {
    const groupedById= {}
    const sortedOrders= orders?.toSorted().reverse()
    // let prevOrder= orders[0]
    if (orders){
    for (const order of sortedOrders){
        if (order.order_id in groupedById) {
            groupedById[order.order_id].push(order)
        } else {
            groupedById[order.order_id]= [order]
        }
        // prevOrder= order
    }
}
    return (
        <div className='orders'>
            {Object.entries(groupedById).map(([order_id, items])=> {
                const provider= services.find((service)=> items[0].provider_id===service.id)
                return <OrderCard provider={provider} order_id={order_id} items={items}/>
             }
             )}
        </div>
    )
}

export default Orders
