const express = require('express');
const cartrouter = express.Router();
const products = require('../model/products');
const jwt = require('jsonwebtoken');
const newMember = require('../model/newMember');
require('dotenv').config()


// to fetch user

// const fetchUser = async (req, res, next) => {
//     const token = req.header('auth-token');

//     if (!token) {
//         res.status(400).send({ error: 'Please authenticate using valid Token' })
//     }
//     else {
//         try {
//             const data = jwt.verify(token, 'secret');
//             req.user = data._id;
//             next();
//         }
//         catch (error) {
//             res.status(400).send({ error: "Please authicate using a Valid token" })
//         }
//     }
// }

cartrouter.post('/addtocart', async (req, res) => {

    const { token } = req.body;

    if (!token) {
        return res.status(400).send({ status: "error", msg: "Please authenticate using a valid token" });
    }
 
    try {
        // Verify the token sent from the frontend
        const decoded = jwt.verify(token, 'secret');
        
        const userData = await newMember.findOne({ _id: decoded._id });

        if (!userData) {
            return res.status(400).send({ status: "error", msg: "User not found" });
        }

        
        res.status(200).send({ status: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send({ status: 'Internal Server Error' });
    }
});



//  endpoint to remove from cart 

cartrouter.post('/removefromcart', async (req, res) => {

    // const userdata = await newMember.findOne({ _id: req.user._id })

    // // check if the user cart data is greater than 0

    // if (userdata.cartData[req.body.itemid] > 0) {
    //     userdata.cartData[req.body.itemid] -= 1;
    // }
    // await newMember.findOneAndUpdate({ _id: req.user._id }, { cartData: userdata.cartData })

    // res.status(200).send({ status: 'Cart Remove' })
})


cartrouter.get('/getcartfromuser', async (req, res) => {

    // const userData = await newMember.findOne({_id: req.user.id})

    // res.status(200).send(userData.cartData)

})
module.exports = cartrouter