const express = require('express');
const cartrouter = express.Router();
const products = require('../model/products');


cartrouter.post('/addtocart', async (req,res) => {
    console.log(req.body);
})


module.exports = cartrouter