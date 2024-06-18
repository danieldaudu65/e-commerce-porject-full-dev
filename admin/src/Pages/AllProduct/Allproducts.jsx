import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import './Allproducts.css'
import Navbar from '../../Components/Navbar/Navbar';

const Allproducts = () => {

    const [allproducts, setAllProducts] = useState([]);

    const fetchInfo = async () => {
        try {
            const response = await fetch('http://localhost:4000/routes/product/all_product');
            const data = await response.json();
            if (data.status && Array.isArray(data.all_products)) {
                setAllProducts(data.all_products);
            } else {
                console.error('Error fetching product data:', data.msg);
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }



    useEffect(() => {
        fetchInfo();
    }, [])


    const removePRoducts = async (id) => {
        await fetch('http://localhost:4000/routes/product/removeproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        await fetchInfo()
    }
    return (
        <>
        <Navbar />
          <div className='all-product'>
            <span className="cart_logo">Cart</span>
            <h1>All Product List</h1>
            <div className="product-list-container">
                <div className="container-titile">
                    <p>Product</p>
                    <p>Title</p>
                    <p>Old Price</p>
                    <p>New Price</p>
                    <p>Remove</p>
                </div>
                <div className="listallProduct">
                    <hr />
                    {allproducts.map((product, index) => {
                        return <div key={index} className='container-titile list-product-container'>
                            <img src={product.image} alt="" className="listproductitem" />
                            <p>{product.name}</p>
                            <p>${product.oldproductPrice}</p>
                            <p>${product.newproductPrice}</p>
                            <FaTimes className='remove-item' onClick={() => { removePRoducts(product.id) }} />
                        </div>
                    })}
                </div>

            </div>
        </div>
        </>
      
    )
}

export default Allproducts
