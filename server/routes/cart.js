const express = require('express');
const cartrouter = express.Router();
const products = require('../admin/model/products');
const jwt = require('jsonwebtoken');
const newMember = require('../model/user');
require('dotenv').config()



cartrouter.post('/addtocart', async (req, res) => {
    const token = req.headers['auth-token'];
    const itemId = req.body.itemId;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('User ID:', decoded._id);
        console.log('Item ID:', itemId);

        const userData = await newMember.findOne({ _id: decoded._id })

        if (!userData) {
            return res.status(400).send({ error: "user not found" })
        }

        // Update the user's cart data
        userData.cartData[itemId] += 1;

        await newMember.findOneAndUpdate({ _id: decoded._id }, { cartData: userData.cartData });

        res.status(200).send({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send({ error: 'Invalid token' });
    }
});

//  endpoint to remove from cart 

cartrouter.post('/removefromcart', async (req, res) => {
    const token = req.headers['auth-token'];
    const itemId = req.body.itemId;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userData = await newMember.findOne({ _id: decoded._id })

        // Check if the user's cart data for the specified item is greater than 0
        if (userData.cartData[itemId] > 0) {
            userData.cartData[itemId] -= 1;
        }

        await newMember.findOneAndUpdate({ _id: decoded._id }, { cartData: userData.cartData })

        res.status(200).send({ status: 'Item removed from cart' });

    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send({ error: 'Invalid token' });
    }
});


// recover cart data from user database

cartrouter.get('/getcartfromuser', async (req, res) => {
    const token  = req.header('auth-token');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userData = await newMember.findOne({ _id: decoded._id });

        const userdatacart = userData.cartData

        res.status(200).send({ userdatacart });
    }
    catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send({ error: 'Invalid token' });
    }
});


module.exports = cartrouter