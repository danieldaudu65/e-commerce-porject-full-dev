import React, { useEffect, useState } from 'react';
import './Pending.css';

const Pending = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/orders/get-all-orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAllOrders(data.all_orders);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('An error occurred while fetching orders', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className='right-page'>
      <h2>All Orders</h2>
      {allOrders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <>
          <div className="container-titile-pending-order">
            <p>Name</p>
            <p>Order</p>
            <p>Product</p>
            <p>Quantity</p>
            <p>Total Price</p>
            <p>Status</p>
          </div>

          <ul>
            {allOrders.map((order, index) => {
              // Variables to store product names and quantities
              const productNames = order.orderItems.map(item => item.product.name).join(', ');
              const quantities = order.orderItems.map(item => item.quantity).join(', ');

              return (
                <li key={index} className='list-container container-titile-pending-order'>
                  <p>{order.user.fullName}</p>
                  <p>{order._id}</p>
                  <p>{productNames}</p>
                  <p>{quantities}</p>
                  <p>{order.totalAmount}</p>
                  <p>{order.status}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default Pending;
