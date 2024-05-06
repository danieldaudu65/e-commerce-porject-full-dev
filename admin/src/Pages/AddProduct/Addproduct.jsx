import React, { useState } from 'react'
import upload from '../../assets/upload.png'
import './Addproduct.css'

const Addproduct = () => {

    const [image, setImage] = useState(false);
    const [productData, setProductData] = useState({
        name: '',
        image: '',
        newproductPrice: '',
        oldproductPrice: ''
    })
    const imageHandlier = (e) => {
        setImage(e.target.files[0]);
    }

    const changeHandlier = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value })
    }
    const addProduct = async () => {
        console.log(productData);
        let responseData;
        let product = productData;

        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json' // Fixed typo here
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                responseData = data;
            });

        if (responseData.success) {
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/routes/product/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(product)
            }).then((resp) => resp.json()).then((data) => {
                if (data.success) {
                    alert('Product Added');
                    window.location.replace('/')
                } else {
                    alert('Product Added');
                    window.location.replace('/')
                }
            })
        }
    };

    return (
        <div className='add-product'>
            <span className="cart_logo">Cart</span>
            <h1>Add A Product</h1>
            <p>Please put in the details of the Product</p>
            <div className="inputfield">
                <div className="price-input">
                    <input value={productData.name} onChange={changeHandlier} type="text" name='name' placeholder='Product Name' />
                </div>
                <div className="price-input">
                    <input value={productData.oldproductPrice} onChange={changeHandlier} type="text" name='oldproductPrice' placeholder='Product Price' />
                </div>
                <div className="price-input">
                    <input value={productData.newproductPrice} onChange={changeHandlier} type="text" name='newproductPrice' placeholder='New Price' />
                </div>
                <div className="add-image">
                    <label htmlFor="file-input" className='file-input'>
                        Add Product Image
                        <img src={image ? URL.createObjectURL(image) : upload} alt="" className='upload' />
                    </label> :
                    <input onChange={imageHandlier} type="file" name='image' id='file-input' className='input-image' />
                </div>
                <button onClick={() => addProduct()} className='addproduct'>Add</button>
            </div>
        </div>
    )
}

export default Addproduct